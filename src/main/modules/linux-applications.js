
import { config } from "../config";
import { readdir, readFile, exists, writeFileSync } from "fs";
import path from 'path';
import { exec } from "child_process";
import { stringMatchQuality } from "../../common/util";

let applications = [];
let icons = {};
let icon_index = null;

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
                });
                exec(`find -L ${icon_path}/${fallback_theme}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                    stdout.split('\n').forEach((value) => {
                        if (!icon_index[path.basename(value)]) {
                            icon_index[path.basename(value)] = value;
                        }
                    });
                    exec(`find -L ${icon_path}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                        stdout.split('\n').forEach((value) => {
                            if (!icon_index[path.basename(value)]) {
                                icon_index[path.basename(value)] = value;
                            }
                        });
                        exec(`find -L ${icon_path_pixmaps}/ -type f`, { maxBuffer: 1024 * 1024 * 500 }, (_, stdout, __) => {
                            stdout.split('\n').forEach((value) => {
                                if (!icon_index[path.basename(value)]) {
                                    icon_index[path.basename(value)] = value;
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
            if(exist) {
                resolve(name);
            } else {
                const possible = [`${name}`, `${name}.svg`, `${name}.png`];
                for(let file of possible) {
                    if(icon_index[file]) {
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
            if(data) {
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
    applications.length = 0;
    applications = (await Promise.all(config.modules.linux_applications.directories.map((directory) => new Promise((resolve) => {
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
                        } catch(e) {
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                });
            })))).filter((entry) => entry) : []);
        });
    })))).reduce((a, b) => a.concat(b));
    const theme = await getIconTheme();
    const fallback_theme = await getIconFallbackTheme();
    await createIconIndex(theme, fallback_theme);
    await Promise.all(applications.map((application) => {
        return Promise.all(Object.values(application).filter((value) => value instanceof Object).map(async (value) => {
            if (getProp(value, 'Icon') && !icons[getProp(value, 'Icon')]) {
                const path = await findIconPath(getProp(value, 'Icon'), theme, fallback_theme);
                if (path) {
                    icons[getProp(value, 'Icon')] = await pathToDataUrl(path);
                }
            }
        }));
    }));
}

const LinuxApplicationModule = {
    init: async () => {
        await loadApplications();
    },
    update: async () => {
        await loadApplications();
    },
    valid: (query) => {
        return config.modules.linux_applications.active && query.length >= 1;
    },
    search: async (query) => {
        return applications.map((app) => {
            const name = getProp(app.desktop, 'Name', app.application.replace('.desktop', ''));
            const desc = getProp(app.desktop, 'Comment', '');
            const icon = icons[getProp(app.desktop, 'Icon')];
            return Object.values(app).filter((value) => value instanceof Object).map((value) => ({
                type: 'icon_list_item',
                uri_icon: icons[getProp(value, 'Icon')] || icon,
                primary: getProp(value, 'Name', name),
                secondary: getProp(value, 'Comment', name),
                executable: true,
                quality: stringMatchQuality(query, name + desc + getProp(app.desktop, 'GenericName', '')),
                app: value,
            }));
        }).reduce((a, b) => a.concat(b));
    },
    execute: (option) => {
        if (getProp(option.app, 'Terminal') === 'true') {
            exec(`xterm -e "${getProp(option.app, 'Exec').replace(/\%./g, '').replace(/\"/g, '\\"')}"`);
        } else {
            exec(`${getProp(option.app, 'Exec').replace(/\%./g, '')}`);
        }
    },
};

export default LinuxApplicationModule;
