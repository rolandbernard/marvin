
import { readFile, writeFile } from "fs/promises";
import { app } from "electron";
import path from 'path';
import { mergeDeep, cloneDeep } from '../common/util';

export const CONFIG_DEFAULT = {
    version: app.getVersion(),
    general: {
        global_shortcut: 'Super+D',
        language: 'en',
        debounce_time: 20,
        width: 600,
        max_height: 500,
        max_results: 200,
        incremental_results: false,
        incremental_result_debounce: 20,
        smooth_scrolling: true,
        recenter_on_show: true,
        exclusive_module_prefix: true,
        enhanced_search: true,
    },
    theme: {
        background_color_input: 'black',
        background_color_output: 'black',
        text_color_input: 'white',
        text_color_output: 'white',
        accent_color_input: 'white',
        accent_color_output: 'white',
        select_color: 'grey',
        select_text_color: 'white',
        border_radius: 0,
        background_blur_input: 0,
        background_blur_output: 0,
        shadow_color_input: '#00000000',
        shadow_color_output: '#00000000',
    },
    modules: {
        linux_system: {
            active: true,
            prefix: '',
        },
        folders: {
            active: true,
            prefix: '',
            directories: ["/", app.getPath('home')],
            file_preview: false,
        },
        html: {
            active: false,
            prefix: '',
            entries: [],
        },
        calculator: {
            active: true,
            prefix: '',
            quality: 1.0,
            backend: 'mathjs',
        },
        linux_applications: {
            active: true,
            prefix: '',
            directories: ["/usr/share/applications/", path.join(app.getPath('home'), '.local/share/applications/')],
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
            shortcuts: [],
        },
        command: {
            active: true,
            prefix: '$',
            quality: 1.0,
        },
        scripts: {
            active: false,
            prefix: '',
            entries: [],
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
            quality: 1.0,
        },
        linux_windows: {
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
            sort_by_frequency: false,
            weight_by_frequency: false,
        },
        color: {
            active: false,
            prefix: '',
            quality: 1,
            color_preview: false,
        },
        web_search: {
            active: false,
            prefix: '',
            patterns: [
                { prefix: 'd?', url_pattern: 'https://duckduckgo.com/?q=$' },
                { prefix: 'g?', url_pattern: 'https://www.google.com/search?q=$' },
                { prefix: 'b?', url_pattern: 'https://www.bing.com/search?q=$' },
                { prefix: 'w?', url_pattern: 'https://en.wikipedia.org/wiki/Special:Search?search=$' },
                { prefix: 's?', url_pattern: 'https://stackoverflow.com/search?q=$' },
            ],
            url_preview: false,
            quality: 1.0,
        },
        alias: {
            active: false,
            prefix: '',
            aliases: [],
            prefix_text: true,
        },
        currency_converter: {
            active: false,
            prefix: '',
            refresh_interval_min: 60,
            quality: 1.0,
        },
        dictionary: {
            active: false,
            prefix: 'dict?',
            debounce_time: 500,
            quality: 1.0,
        },
        bookmarks: {
            active: false,
            prefix: '',
            url_preview: false,
        },
        email: {
            active: false,
            prefix: '',
            quality: 1.0,
        },
    },
};

export let config = CONFIG_DEFAULT;

const CONFIG_FILENAME = 'marvin.json';

export async function loadConfig() {
    const config_path = path.join(app.getPath('userData'), CONFIG_FILENAME);
    try {
        config = mergeDeep(cloneDeep(config), JSON.parse(await readFile(config_path, { encoding: 'utf8' })));
    } catch (e) { /* Ignore errors? */ }
    config.version = app.getVersion();
    await writeFile(config_path, JSON.stringify(config), { encoding: 'utf8' });
}

export async function updateConfig(new_config) {
    const config_path = path.join(app.getPath('userData'), CONFIG_FILENAME);
    config = mergeDeep(cloneDeep(config), new_config);
    await writeFile(config_path, JSON.stringify(config), { encoding: 'utf8' });
}
