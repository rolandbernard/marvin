
import { existsSync, readFileSync, writeFileSync } from "fs";
import { clipboard, app, ipcMain } from 'electron';
import { config } from '../config';
import { stringMatchQuality } from "../search";
import { getAllTranslation } from '../../common/local/locale';
import path from 'path';

let clipboard_history = [];

const CLIPBOARD_FILENAME = 'clipboard.json';

function loadClipboard() {
    const clipboard_path = path.join(app.getPath('userData'), CLIPBOARD_FILENAME);
    if (existsSync(clipboard_path)) {
        try {
            clipboard_history = JSON.parse(readFileSync(clipboard_path, { encoding: 'utf8' }));
        } catch (e) { }
    }
    writeFileSync(clipboard_path, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}

function updateClipboard() {
    const clipboard_path = path.join(app.getPath('userData'), CLIPBOARD_FILENAME);
    writeFileSync(clipboard_path, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}
    
ipcMain.on('reset-clipboard', (_) => {
    clipboard_history = [];
    updateClipboard();
});

let interval = null;

const ClipboardModule = {
    init: async () => {
        if (config.modules.clipboard.active) {
            loadClipboard();
            interval = setInterval(() => {
                const text = clipboard.readText();
                if (text && clipboard_history[0] !== text) {
                    clipboard_history = Array.from(new Set([text].concat(clipboard_history))).slice(0, config.modules.clipboard.maximum_history);
                    updateClipboard();
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
    },
    valid: (query) => {
        return query.trim().length > 0;
    },
    search: async (query, regex) => {
        const clipboard_match = Math.max(...(
            getAllTranslation('clipboard').map((trans) => stringMatchQuality(query, trans, regex))
        ));
        return clipboard_history.map((text) => ({
            type: 'icon_text',
            material_icon: 'assignment',
            text: text,
            executable: true,
            quality: 0.75 * Math.max(stringMatchQuality(query, text, regex), clipboard_match),
        }));
    },
    execute: async (option) => {
        clipboard.writeText(option.text);
    },
}

export default ClipboardModule;
