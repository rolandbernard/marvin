
import { readdir, writeFile, readFile, stat } from "fs/promises";
import { app, ipcMain } from 'electron';
import path from 'path';
import { exec } from "child_process";

import { config } from "../config";
import { stringMatchQuality } from '../search';

let applications = [];
let icons = {};
let icon_index = null;

const APPLICATION_CACHE_FILENAME = 'applications.json';

async function loadApplicationCache() {
    const cache_path = path.join(app.getPath('userData'), APPLICATION_CACHE_FILENAME);
    try {
        applications = JSON.parse(await readFile(cache_path, { encoding: 'utf8' }));
    } catch (e) { }
    await writeFile(cache_path, JSON.stringify(applications), { encoding: 'utf8' });
}

async function updateCache() {
    const cache_path = path.join(app.getPath('userData'), APPLICATION_CACHE_FILENAME);
    await writeFile(cache_path, JSON.stringify(applications), { encoding: 'utf8' });
}

function getProp(object, name, fallback) {
    return (object[name] instanceof Object)
        ? (object[name][config.general.language] || object[name]['default'] || object[name]['en'] || fallback)
        : (object[name] || fallback);
}

function getProps(object, name) {
    if (object[name] instanceof Object) {
        return Object.keys(object[name]).map(key => [object[name][key], key.toLowerCase()]);
    } else if (object[name]) {
        return [ [object[name], 'default'] ];
    } else {
        return [];
    }
}

function promiseExec(command) {
    return new Promise((resolve) => {
        exec(command, (_err, stdout, _stderr) => {
            resolve(stdout);
        });
    });
}

async function getIconTheme() {
    const theme = await promiseExec(`gtk-query-settings gtk-icon-theme-name | awk -F: '{print $2; exit}' | head -c -2 | tail -c +3`);
    return theme && theme.trim();
}

async function getIconFallbackTheme() {
    const theme = await promiseExec(`gtk-query-settings gtk-fallback-icon-theme | awk -F: '{print $2; exit}' | head -c -2 | tail -c +3`);
    return theme && theme.trim();
}

async function indexIconsFromPath(theme_path) {
    const find_output = await promiseExec(`find -L ${theme_path} -type f`);
    if (find_output) {
        const files = find_output.split('\n');
        for (const file of files) {
            if (!icon_index[path.basename(file)]) {
                icon_index[path.basename(file)] = file;
            }
            if (!icon_index[path.basename(file).toLowerCase()]) {
                icon_index[path.basename(file).toLowerCase()] = file;
            }
        }
    }
}

async function createIconIndex(theme, fallback_theme) {
    const icon_path = '/usr/share/icons';
    const icon_path_pixmaps = "/usr/share/pixmaps";
    if (!icon_index) {
        icon_index = {};
        await indexIconsFromPath(path.join(icon_path, theme));
        await indexIconsFromPath(path.join(icon_path, fallback_theme));
        await indexIconsFromPath(icon_path);
        await indexIconsFromPath(icon_path_pixmaps);
    }
}

async function findIconPath(name) {
    if (name) {
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
    } else {
        return null;
    }
}

function pathToUrl(path) {
    return `file://${path}`;
}

function parseDesktopFile(data) {
    const application = { };
    const lines = data.split('\n').filter((line) => line).map((line) => line.trim()).filter((line) => !line.startsWith('#'));
    let entry = null;
    for (let line of lines) {
        if (line[0] === '[') {
            if (line.startsWith('[Desktop Entry')) {
                entry = 'desktop';
                application[entry] = {};
            } else if (line.startsWith('[Desktop Action')) {
                entry = line.substr(16).trim().replace(']', '');
                application[entry] = {};
            } else {
                entry = null;
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
                } else if (!(application[entry][index[0]] instanceof Object)) {
                    application[entry][index[0]] = { 'default': application[entry][index[0]] };
                }
                application[entry][index[0]][index[1]] = option[1];
            } else {
                if (application[entry][option[0]] instanceof Object) {
                    application[entry][option[0]]['default'] = option[1];
                } else {
                    application[entry][option[0]] = option[1];
                }
            }
        }
    }
    return application;
}

async function loadApplications() {
    const theme = await getIconTheme();
    const fallback_theme = await getIconFallbackTheme();
    await createIconIndex(theme, fallback_theme);
    applications = [];
    for (const directory of config.modules.linux_applications.directories) {
        try {
            const files = await readdir(directory);
            for (const file of files) {
                if (file.endsWith('.desktop')) {
                    try {
                        const data = await readFile(path.join(directory, file), { encoding: 'utf8' });
                        const application = parseDesktopFile(data);
                        application.application = file;
                        applications.push(application);
                    } catch(e) { /* Ignore errors */ }
                }
            }
        } catch(e) { /* Ignore errors */ }
    }
    for (const application of applications) {
        for (const value of Object.values(application)) {
            if (value instanceof Object) {
                const icon = getProp(value, 'Icon');
                if (icon && !icons[icon]) {
                    const path = await findIconPath(icon, theme, fallback_theme);
                    if (path) {
                        icons[icon] = pathToUrl(path);
                    }
                }
                value.icon = icons[icon];
            }
        }
    }
    await updateCache();
}

function getQualityForProp(object, prop, text, regex, scale) {
    return Math.max(0, ...(getProps(object, prop)
        .map(([value, lang]) =>
            scale * (lang === 'default' || lang.toLowerCase().includes(config.general.language) ? 1 : 0.5) * stringMatchQuality(text, value, regex)
        )
    ));
}
    
ipcMain.on('update-applications', () => {
    loadApplications();
});

let update_interval = null;

const LinuxApplicationModule = {
    init: async () => {
        if (config.modules.linux_applications.active) {
            await loadApplicationCache();
            loadApplications();
            update_interval = setInterval(() => loadApplications(), 60 * 1000 * config.modules.linux_applications.refresh_interval_min);
        }
    },
    update: async () => {
        await LinuxApplicationModule.deinit();
        await LinuxApplicationModule.init();
    },
    deinit: async () => {
        clearInterval(update_interval);
    },
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query, regex) => {
        return applications.map((app) => {
            const name = getProp(app.desktop, 'Name', app.application.replace('.desktop', ''));
            const app_match = Math.max(
                getQualityForProp(app.desktop, 'Name', query, regex, 1),
                getQualityForProp(app.desktop, 'Keywords', query, regex, 0.5),
                getQualityForProp(app.desktop, 'Categories', query, regex, 0.5),
                getQualityForProp(app.desktop, 'Comment', query, regex, 0.5),
                getQualityForProp(app.desktop, 'GenericName', query, regex, 0.5),
                getQualityForProp(app.desktop, '.desktop', query, regex, 0.5),
            );
            const icon = app.desktop.icon;
            return Object.values(app).filter((value) => value instanceof Object).map((value) => ({
                type: 'icon_list_item',
                uri_icon: value.icon || icon,
                primary: getProp(value, 'Name', name),
                secondary: getProp(value, 'Comment', name),
                executable: true,
                quality: Math.max(
                    app_match,
                    getQualityForProp(value, 'Name', query, regex, 0.5),
                    getQualityForProp(value, 'Comment', query, regex, 0.25),
                ),
                app: value,
            }));
        }).flat();
    },
    execute: async (option) => {
        if (getProp(option.app, 'Terminal') === 'true') {
            exec(`xterm -e '${getProp(option.app, 'Exec').replace(/\%./g, '').replace(/\'/g, "'\\''")}'`);
        } else {
            exec(`${getProp(option.app, 'Exec').replace(/\%./g, '')}`);
        }
    },
};

export default LinuxApplicationModule;
