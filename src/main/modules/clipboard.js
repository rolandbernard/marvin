
import { existsSync, readFileSync, writeFileSync } from "fs";
import { clipboard, app } from 'electron';
import { config } from '../config';
import { stringMatchQuality } from '../../common/util';
import { getTranslation } from '../../common/local/locale';
import path from 'path';
import { mergeDeep } from '../../common/util';

let clipboard_history = [];

const clipboard_filename = 'clipboard.json';

export function loadClipboard() {
    const clipboard_path = path.join(app.getPath('userData'), clipboard_filename);
    if (existsSync(path)) {
        try {
            clipboard_history = mergeDeep(clipboard_history, JSON.parse(readFileSync(clipboard_path, { encoding: 'utf8' })));
        } catch (e) { }
    }
    writeFileSync(clipboard_path, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}

export function updateClipboard(new_config) {
    const clipboard_path = path.join(app.getPath('userData'), clipboard_filename);
    clipboard_history = mergeDeep(clipboard_history, new_config);
    writeFileSync(clipboard_path, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}

let interval = null;

const ClipboardModule = {
    init: async () => {
        if (config.modules.clipboard.active) {
            loadClipboard();
            interval = setInterval(() => {
                const text = clipboard.readText();
                if (text && clipboard_history[0] !== text) {
                    clipboard_history = [text].concat(clipboard_history).slice(0, config.modules.clipboard.maximum_history);
                }
            }, config.modules.clipboard.refresh_time);
        }
    },
    update: async () => {
        await ClipboardModule.deinit();
        await ClipboardModule.init();
    },
    deinit: async () => {
        clearInterval(interval);
        updateClipboard(clipboard_history);
    },
    valid: (query) => {
        return config.modules.clipboard.active && query.length > 0;
    },
    search: async (query) => {
        const clipboard_match = stringMatchQuality(query, getTranslation(config, 'clipboard'));
        return clipboard_history.map((text) => ({
            type: 'icon_text',
            material_icon: 'assignment',
            text: text,
            executable: true,
            quality: 0.75 * Math.max(stringMatchQuality(query, text), clipboard_match),
        }));
    },
    execute: async (option) => {
        clipboard.writeText(option.text);
    },
}

export default ClipboardModule;

