
import { existsSync, readFileSync, writeFileSync } from "fs";
import { app } from "electron";
import path from 'path';
import { mergeDeep } from '../common/util';

export let config_default = {
    version: app.getVersion(),
    general: {
        global_shortcut: 'Super+D',
        language: 'en',
        debounce_time: 100,
        width: 600,
        max_height: 500,
        max_results: 200,
        incremental_results: true,
        smooth_scrolling: true,
        recenter_on_show: true,
    },
    theme: {
        background_color_input: 'black',
        background_color_output: 'black',
        text_color_input: 'white',
        text_color_output: 'white',
        accent_color: 'white',
        select_color: 'grey',
        border_radius: 0,
        background_blur_input: 0,
        background_blur_output: 0,
    },
    modules: {
        linux_system: {
            active: true,
            prefix: '',
        },
        folders: {
            active: true,
            prefix: '',
            directories: [ "/", app.getPath('home') ],
            file_preview: false,
        },
        html: {
            active: false,
            prefix: '',
            entries: [ ],
        },
        calculator: {
            active: true,
            prefix: '',
            quality: 1.0,
        },
        linux_applications: {
            active: true,
            prefix: '',
            directories: [ "/usr/share/applications/", path.join(app.getPath('home'), '.local/share/applications/') ],
            refresh_interval_min: 30, 
        },
        url: {
            active: true,
            prefix: '',
            quality: 1.0,
            url_preview: false,
        },
        locate: {
            active: false,
            prefix: '',
            search_limit: 1000,
            file_preview: false,
        },
        shortcuts: {
            active: false,
            prefix: '',
            shortcuts: [ ],
        },
        command: {
            active: true,
            prefix: '$',
        },
        scripts: {
            active: false,
            prefix: '',
            entries: [ ],
        },
        clipboard: {
            active: false,
            prefix: '',
            refresh_time: 20,
            maximum_history: 1000,
        },
        deepl: {
            active: false,
            prefix: '',
        },
        linux_windows: {
            active: false,
            prefix: '',
        },
        google_translate: {
            active: false,
            prefix: '',
        },
        duckduckgo: {
            active: false,
            prefix: '',
            debounce_time: 500,
            quality: 0.1,
            url_preview: false,
        },
        history: {
            active: false,
            searchable: true,
            prefix: '',
            quality: 0.1,
            maximum_history: 1000,
        },
        color: {
            active: false,
            prefix: '',
            quality: 1,
            color_preview: false,
        },
    },
};

export let config = config_default;

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
