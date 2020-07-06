
import { existsSync, readFileSync, writeFileSync } from "fs";
import { app } from "electron";
import path from 'path';
import { mergeDeep } from '../common/util';

export let config = {
    general: {
        global_shortcut: 'Super+D',
        language: 'en',
        debounce_time: 100,
        width: 600,
        max_height: 500,
        max_results: 200,
    },
    theme: {
        background_color: 'black',
        text_color: 'white',
        accent_color: 'white',
        select_color: 'grey',
    },
    modules: {
        marvin_quote: {
            active: true,
            quality: 1.0,
        },
        linux_system: {
            active: true,
        },
        folders: {
            active: true,
            directories: [ "/", app.getPath('home') ],
        },
        html: {
            active: false,
            entries: [ ],
        },
        calculator: {
            active: true,
            quality: 1.0,
        },
        linux_applications: {
            active: true,
            directories: [ "/usr/share/applications/", path.join(app.getPath('home'), '.local/share/applications/') ],
        },
        url: {
            active: true,
            quality: 1.0,
        },
        shortcuts: {
            active: false,
            shortcuts: [
                { shortcut: 'Super+C', script: 'code' },
            ],
        },
    },
};

const config_filename = 'marvin.json';

export function loadConfig() {
    const config_path = path.join(app.getPath('userData'), config_filename);
    if (existsSync(config_path)) {
        try {
            config = mergeDeep(config, JSON.parse(readFileSync(config_path, { encoding: 'utf8' })));
        } catch (e) { }
    }
    writeFileSync(config_path, JSON.stringify(config), { encoding: 'utf8' });
}

export function updateConfig(new_config) {
    const config_path = path.join(app.getPath('userData'), config_filename);
    config = mergeDeep(config, new_config);
    writeFileSync(config_path, JSON.stringify(config), { encoding: 'utf8' });
}
