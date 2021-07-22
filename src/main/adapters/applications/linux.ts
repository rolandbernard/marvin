
import { app } from 'electron';
import { readFile, writeFile, stat, readdir } from 'fs/promises';
import { join, basename } from 'path';
import { spawn } from 'child_process';

import { Application } from 'main/adapters/applications/applications';
import { CommandMode, executeCommand } from 'main/adapters/commands';

export function getDefaultDirectoriesLinux(): string[] {
    return [
        '/usr/share/applications/',
        join(app.getPath('home'), '.local/share/applications/'),
    ];
}

let loaded = false;
let applications: Application[] = [];
let icons: Record<string, string> = {};
let indexed = false;
let icon_index: Record<string, string> = {};

const APPLICATION_CACHE_FILENAME = 'applications.json';
const CACHE_PATH = join(app.getPath('userData'), APPLICATION_CACHE_FILENAME);

async function loadApplicationCache() {
    if (!loaded) {
        try {
            applications = JSON.parse(await readFile(CACHE_PATH, { encoding: 'utf8' }));
            loaded = true;
        } catch (e) { /* Ignore errors */ }
    }
}

async function updateCache() {
    try {
        await writeFile(CACHE_PATH, JSON.stringify(applications), { encoding: 'utf8' });
    } catch (e) { /* Ignore errors */  }
}

async function getIconTheme() {
    const theme = await executeCommand(`gtk-query-settings gtk-icon-theme-name | awk -F: '{print $2; exit}' | head -c -2 | tail -c +3`);
    return theme?.stdout.trim() ?? '';
}

async function getIconFallbackTheme() {
    const theme = await executeCommand(`gtk-query-settings gtk-fallback-icon-theme | awk -F: '{print $2; exit}' | head -c -2 | tail -c +3`);
    return theme?.stdout.trim() ?? '';
}

function indexIconsFromPath(theme_path: string) {
    return new Promise((res, rej) => {
        try {
            const child = spawn('find', ['-L', theme_path, '-type', 'f']);
            child.on('exit', res);
            child.on('error', rej);
            let last = '';
            child.stdout.setEncoding('utf8');
            child.stdout.on('data', (chunk: string) => {
                const split = (last + chunk).split('\n');
                if (split.length > 0) {
                    last = split.pop()!;
                    for (const file of split) {
                        if (!icon_index[basename(file)]) {
                            icon_index[basename(file)] = file;
                        }
                        if (!icon_index[basename(file).toLowerCase()]) {
                            icon_index[basename(file).toLowerCase()] = file;
                        }
                    }
                }
            });
        } catch (e) {
            rej(e);
        }
    });
}

async function createIconIndex() {
    const icon_path = '/usr/share/icons';
    const icon_path_pixmaps = "/usr/share/pixmaps";
    await Promise.all([
        indexIconsFromPath(join(icon_path, await getIconTheme())),
        indexIconsFromPath(join(icon_path, await getIconFallbackTheme())),
        indexIconsFromPath(icon_path),
        indexIconsFromPath(icon_path_pixmaps),
    ]);
}

async function findIconPath(name: string) {
    const possible = [
        `${name}.svg`,
        `${name}.png`,
        `${name}.jpg`,
        `${name}.jpeg`,
        `${name.toLowerCase()}.svg`,
        `${name.toLowerCase()}.png`,
        `${name.toLowerCase()}.jpg`,
        `${name.toLowerCase()}.jpeg`,
        `${name.toLowerCase()}`,
        `${name}`,
    ];
    for (const file of possible) {
        try {
            const stats = await stat(file);
            if (stats.isFile()) {
                return file;
            }
        } catch (e) { /* Ignore errors */ }
        if (icon_index[file]) {
            return icon_index[file];
        }
    }
}

type Action = Record<string, Record<string, string>>;
type Desktop = Record<string, Action>;

function parseDesktopFile(data: string) {
    const application: Desktop = { };
    const lines = data.split('\n')
        .filter((line) => line)
        .map((line) => line.trim())
        .filter((line) => !line.startsWith('#'));
    let entry: string | undefined;
    for (let line of lines) {
        if (line[0] === '[') {
            if (line.startsWith('[Desktop Entry')) {
                entry = 'desktop';
                application[entry] = {};
            } else if (line.startsWith('[Desktop Action')) {
                entry = line.substr(16).trim().replace(']', '');
                application[entry] = {};
            }
        } else if (entry) {
            let option;
            if (line.includes('=')) {
                const split = line.indexOf('=');
                option = [ line.substr(0, split).trim(), line.substr(split + 1).trim() ];
            } else {
                option = [ line.trim() ];
            }
            if (option[0].endsWith(']')) {
                let index = option[0].split('[');
                index[1] = index[1].replace(']', '');
                index = index.map((value) => value.trim());
                if (!application[entry][index[0]]) {
                    application[entry][index[0]] = {};
                }
                application[entry][index[0]][index[1]] = option[1];
            } else {
                if (!application[entry][option[0]]) {
                    application[entry][option[0]] = {};
                }
                application[entry][option[0]]['default'] = option[1];
            }
        }
    }
    return application;
}

async function getApplicationIcon(icon?: string) {
    if (icon) {
        const path = await findIconPath(icon);
        if (path) {
            icons[icon] = `file://${path}`;
        }
        return icons[icon];
    }
}

function collectOther(desktop: Desktop, action: Action) {
    const ret: Record<string, string[]> = {};
    const keys = [ 'Keywords', 'Categories', 'GenericName' ];
    for (const key of keys) {
        if (desktop['desktop']?.[key]) {
            for (const lang in desktop['desktop'][key]) {
                ret[lang] = [ ...(ret[lang] ?? []), desktop['desktop'][key][lang] ];
            }
        }
        if (action[key]) {
            for (const lang in action[key]) {
                ret[lang] = [ ...(ret[lang] ?? []), action[key][lang] ];
            }
        }
    }
    return ret;
}

async function addApplication(desktop: Desktop, file: string) {
    for (const action of Object.values(desktop)) {
        applications.push({
            file: file,
            application: action,
            icon: await getApplicationIcon(action['Icon']?.['default'])
                ?? await getApplicationIcon(desktop['desktop']?.['Icon']?.['default']),
            name: desktop['desktop']?.['Name'] ?? {},
            action: action['Name'] ?? {},
            description: action['Comment'] ?? desktop['desktop']?.['Comment'] ?? {},
            other: collectOther(desktop, action),
        });
    }
}

export async function updateApplicationCacheLinux(directories: string[]) {
    await loadApplicationCache();
    if (!indexed) {
        try {
            await createIconIndex();
            indexed = true;
        } catch (e) { /* Ignore errors */  }
    }
    applications = [];
    for (const directory of directories) {
        try {
            const files = await readdir(directory);
            for (const file of files) {
                if (file.endsWith('.desktop')) {
                    try {
                        const path = join(directory, file);
                        const data = await readFile(path, { encoding: 'utf8' });
                        await addApplication(parseDesktopFile(data), path);
                    } catch(e) { /* Ignore errors */ }
                }
            }
        } catch(e) { /* Ignore errors */ }
    }
    await updateCache();
}

export async function getAllApplicationsLinux(): Promise<Application[]> {
    return applications;
}

export function executeApplicationLinux(application: any) {
    const exec = application['Exec']?.['default']?.replace(/\%./g, '');
    if (exec) {
        if (application['Terminal']?.['default'] === 'true') {
            executeCommand(exec, CommandMode.TERMINAL);
        } else {
            executeCommand(exec);
        }
    }
}

