
import { config } from "../config";
import { readdir, readFile, exists, writeFileSync, existsSync, readFileSync } from "fs";
import { app } from 'electron';
import path, { join } from 'path';
import { exec } from "child_process";
import { stringMatchQuality } from "../../common/util";

let applications = [];
let icons = {};
let icon_index = null;

const APPLICATION_CACHE_FILENAME = 'applications.json';

function loadApplicationCache() {
    const cache_path = path.join(app.getPath('userData'), APPLICATION_CACHE_FILENAME);
    if (existsSync(cache_path)) {
        try {
            applications = JSON.parse(readFileSync(cache_path, { encoding: 'utf8' }));
        } catch (e) { }
    }
    writeFileSync(cache_path, JSON.stringify(applications), { encoding: 'utf8' });
}

function updateCache() {
    const cache_path = path.join(app.getPath('userData'), APPLICATION_CACHE_FILENAME);
    writeFileSync(cache_path, JSON.stringify(applications), { encoding: 'utf8' });
}

function getProp(object, name, fallback) {
    return (object[name] instanceof Object)
        ? (object[name][config.general.language] || object[name]['default'])
        : (object[name] || fallback);
}

function getIconTheme() {
    return new Promise((resolve) => {
        exec(`gtk-query-settings gtk-icon-theme-name | awk -F: '{print $2; exit}' | head -c -2 | tail -c +3`, (_, stdout, __) => {
            const theme = stdout && stdout.trim();
            if (theme) {
                resolve(theme);
            } else {
                resolve(null);
            }
        });
    });
}

function getIconFallbackTheme() {
    return new Promise((resolve) => {
        exec(`gtk-query-settings gtk-fallback-icon-theme | awk -F: '{print $2; exit}' | head -c -2 | tail -c +3`, (_, stdout, __) => {
            const theme = stdout && stdout.trim();
            if (theme) {
                resolve(theme);
            } else {
                resolve(null);
            }
        });
    });
}

function createIconIndex(theme, fallback_theme) {
    const icon_path = '/usr/share/icons';
    const icon_path_pixmaps = "/usr/share/pixmaps";
    return new Promise((resolve) => {
        if (icon_index) {
            resolve();
        } else {
            icon_index = {};
            exec(`find -L ${icon_path}/${theme}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                stdout.split('\n').forEach((value) => {
                    if (!icon_index[path.basename(value)]) {
                        icon_index[path.basename(value)] = value;
                    }
                    if (!icon_index[path.basename(value).toLowerCase()]) {
                        icon_index[path.basename(value).toLowerCase()] = value;
                    }
                });
                exec(`find -L ${icon_path}/${fallback_theme}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                    stdout.split('\n').forEach((value) => {
                        if (!icon_index[path.basename(value)]) {
                            icon_index[path.basename(value)] = value;
                        }
                        if (!icon_index[path.basename(value).toLowerCase()]) {
                            icon_index[path.basename(value).toLowerCase()] = value;
                        }
                    });
                    exec(`find -L ${icon_path}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                        stdout.split('\n').forEach((value) => {
                            if (!icon_index[path.basename(value)]) {
                                icon_index[path.basename(value)] = value;
                            }
                            if (!icon_index[path.basename(value).toLowerCase()]) {
                                icon_index[path.basename(value).toLowerCase()] = value;
                            }
                        });
                        exec(`find -L ${icon_path_pixmaps}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                            stdout.split('\n').forEach((value) => {
                                if (!icon_index[path.basename(value)]) {
                                    icon_index[path.basename(value)] = value;
                                }
                                if (!icon_index[path.basename(value).toLowerCase()]) {
                                    icon_index[path.basename(value).toLowerCase()] = value;
                                }
                            });
                            resolve();
                        });
                    });
                });
            });
        }
    });
}

function findIconPath(name) {
    return new Promise((resolve) => {
        exists(name, (exist) => {
            if (exist) {
                resolve(name);
            } else {
                const possible = [
                    `${name}`,
                    `${name}.svg`,
                    `${name}.png`,
                    `${name.toLowerCase()}`,
                    `${name.toLowerCase()}.svg`,
                    `${name.toLowerCase()}.png`
                ];
                for (let file of possible) {
                    if (icon_index[file]) {
                        resolve(icon_index[file]);
                        return;
                    }
                }
                resolve(null);
            }
        });
    });
}

function pathToDataUrl(path) {
    return new Promise((resolve) => {
        readFile(path, (_, data) => {
            if (data) {
                const mime_endings = {
                    '__default__': 'text/plain',
                    '.png': 'image/png',
                    '.svg': 'image/svg+xml',
                };
                let mime = mime_endings[Object.keys(mime_endings).find((ending) => path.endsWith(ending)) || '__default__'];
                resolve(`data:${mime};base64,${Buffer.from(data).toString('base64')}`);
            } else {
                resolve(null);
            }
        });
    });
}

async function loadApplications() {
    const theme = await getIconTheme();
    const fallback_theme = await getIconFallbackTheme();
    await createIconIndex(theme, fallback_theme);
    applications = (await Promise.all((await Promise.all(config.modules.linux_applications.directories.map((directory) => new Promise((resolve) => {
        readdir(directory, async (_, files) => {
            resolve(files ? (await Promise.all(files.filter((file) => file.endsWith('.desktop')).map((file) => new Promise((resolve) => {
                readFile(path.join(directory, file), { encoding: 'utf8' }, (_, data) => {
                    if (data) {
                        try {
                            let ret = { application: file };
                            const lines = data.split('\n').filter((line) => line).map((line) => line.trim()).filter((line) => !line.startsWith('#'));
                            let entry = null;
                            for (let line of lines) {
                                if (line[0] === '[') {
                                    if (line.startsWith('[Desktop Entry')) {
                                        entry = 'desktop';
                                        ret[entry] = {};
                                    } else if (line.startsWith('[Desktop Action')) {
                                        entry = line.substr(16).trim().replace(']', '');
                                        ret[entry] = {};
                                    } else {
                                        entry = null;
                                    }
                                } else if (entry) {
                                    let option = line.split('=').map((value) => value.trim());
                                    if (option[0].endsWith(']')) {
                                        let index = option[0].split('[');
                                        index[1] = index[1].replace(']', '');
                                        index = index.map((value) => value.trim());
                                        if (!ret[entry][index[0]]) {
                                            ret[entry][index[0]] = {};
                                        } else if (!(ret[entry][index[0]] instanceof Object)) {
                                            ret[entry][index[0]] = { 'default': ret[entry][index[0]] };
                                        }
                                        ret[entry][index[0]][index[1]] = option[1];
                                    } else {
                                        if (ret[entry][option[0]] instanceof Object) {
                                            ret[entry][option[0]]['default'] = option[1];
                                        } else {
                                            ret[entry][option[0]] = option[1];
                                        }
                                    }
                                }
                            }
                            resolve(ret);
                        } catch (e) {
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                });
            })))).filter((entry) => entry) : []);
        });
    })))).flat().map(async (application) => {
        await Promise.all(Object.values(application).filter((value) => value instanceof Object).map(async (value) => {
            if (getProp(value, 'Icon') && !icons[getProp(value, 'Icon')]) {
                const path = await findIconPath(getProp(value, 'Icon'), theme, fallback_theme);
                if (path) {
                    icons[getProp(value, 'Icon')] = await pathToDataUrl(path);
                }
            }
            value.icon = icons[getProp(value, 'Icon')];
        }));
        return application;
    })));
    updateCache();
}

let update_interval = null;

const LinuxApplicationModule = {
    init: async () => {
        if (config.modules.linux_applications.active) {
            loadApplicationCache();
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
    search: async (query) => {
        return applications.map((app) => {
            const name = getProp(app.desktop, 'Name', app.application.replace('.desktop', ''));
            const desc = getProp(app.desktop, 'Comment', '');
            const icon = app.desktop.icon;
            return Object.values(app).filter((value) => value instanceof Object).map((value) => ({
                type: 'icon_list_item',
                uri_icon: value.icon || icon,
                primary: getProp(value, 'Name', name),
                secondary: getProp(value, 'Comment', name),
                executable: true,
                quality: Math.max(stringMatchQuality(query, name),
                    0.75 * stringMatchQuality(query, desc),
                    0.75 * stringMatchQuality(query, getProp(app.desktop, 'Keywords', '')),
                    0.75 * stringMatchQuality(query, getProp(app.desktop, 'Categories', '')),
                    0.75 * stringMatchQuality(query, app.application.replace('.desktop', '')),
                    0.75 * stringMatchQuality(query, getProp(app.desktop, 'GenericName', '')),
                    0.25 * stringMatchQuality(query, getProp(value, 'Name', name))),
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
