
import { readFile, writeFile } from "fs/promises";
import { clipboard, app, ipcMain } from 'electron';
import { config } from '../config';
import { stringMatchQuality } from "../search";
import { getAllTranslation } from '../../common/local/locale';
import path from 'path';

let clipboard_history = [];

const CLIPBOARD_FILENAME = 'clipboard.json';

async function loadClipboard() {
    const clipboard_path = path.join(app.getPath('userData'), CLIPBOARD_FILENAME);
    try {
        clipboard_history = JSON.parse(await readFile(clipboard_path, { encoding: 'utf8' }));
    } catch (e) { }
    await writeFile(clipboard_path, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}

async function updateClipboard() {
    const clipboard_path = path.join(app.getPath('userData'), CLIPBOARD_FILENAME);
    await writeFile(clipboard_path, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}

ipcMain.on('reset-clipboard', async _ => {
    clipboard_history = [];
    await updateClipboard();
});

let interval = null;

const ClipboardModule = {
    init: async () => {
        if (config.modules.clipboard.active) {
            await loadClipboard();
            interval = setInterval(async () => {
                const text = clipboard.readText();
                if (text && clipboard_history[0] !== text) {
                    clipboard_history = Array.from(new Set([text].concat(clipboard_history))).slice(0, config.modules.clipboard.maximum_history);
                    await updateClipboard();
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
        const language = config.general.language;
        const clipboard_match = Math.max(...(
            getAllTranslation('clipboard').map(([trans, lang]) => (lang === language ? 1 : 0.5) * stringMatchQuality(query, trans, regex))
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
