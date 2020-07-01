
import { existsSync, readFileSync, writeFileSync } from "fs";
import { app } from "electron";
import path from 'path';

export let config = {
    general: {
        global_shortcut: 'Super+D',
        language: 'en',
        debounce_time: 0,
        width: 600,
        max_height: 500,
    },
    theme: {
        background_color: 'black',
        text_color: 'white',
        accent_color: 'grey',
        select_color: 'blue',
    },
};

export function loadConfig() {
    const config_path = path.join(app.getPath('userData'), 'config.json');
    console.log(config_path);
    if (existsSync(config_path)) {
        config = JSON.parse(readFileSync(config_path, { encoding: 'utf8' }));
    } else {
        writeFileSync(config_path, JSON.stringify(config), { encoding: 'utf8' });
    }
}
