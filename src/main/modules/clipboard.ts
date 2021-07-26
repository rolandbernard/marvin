
import { app, clipboard, ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { TextResult } from 'common/result';
import { Module } from 'common/module';
import { getAllTranslations, getTranslation } from 'common/local/locale';
import { time, TimeUnit } from 'common/time';

import { module } from 'main/modules';
import { moduleConfig, config } from 'main/config';

const CLIPBOARD_FILENAME = 'clipboard.json';
const CLIPBOARD_PATH = join(app.getPath('userData'), CLIPBOARD_FILENAME);

let loaded = false;
let clipboard_history: string[] = [];

async function loadClipboard() {
    if (!loaded) {
        try {
            clipboard_history = JSON.parse(await readFile(CLIPBOARD_PATH, { encoding: 'utf8' }));
            loaded = true;
        } catch (e) { }
    }
}

async function updateClipboard() {
    await writeFile(CLIPBOARD_PATH, JSON.stringify(clipboard_history), { encoding: 'utf8' });
}

ipcMain.on('reset-clipboard', () => {
    clipboard_history = [];
    updateClipboard();
});

const MODULE_ID = 'clipboard';

class ClipboardConfig extends ModuleConfig {
    @configKind('time')
    refresh_time = time(20, TimeUnit.MILLISECONDS);

    @configKind('amount')
    maximum_history = 1000;

    @configKind('quality')
    default_quality = 0;

    constructor() {
        super(true);
        this.addConfigField({
            kind: 'button',
            name: 'clear_history',
            action: 'reset-clipboard',
            confirm: true,
        });
    }
}

@module(MODULE_ID)
export class ClipboardModule implements Module<TextResult> {
    readonly configs = ClipboardConfig;

    interval?: NodeJS.Timer;

    get config() {
        return moduleConfig<ClipboardConfig>(MODULE_ID);
    }

    async init() {
        if (this.config.active) {
            await loadClipboard();
            this.interval = setInterval(() => {
                const text = clipboard.readText();
                if (text && clipboard_history[0] !== text) {
                    clipboard_history = Array.from(new Set([text].concat(clipboard_history)))
                        .slice(0, this.config.maximum_history);
                    updateClipboard();
                }
            }, this.config.refresh_time);
        }
    }

    async update() {
        await this.deinit();
        await this.init();
    }

    async deinit() {
        clearInterval(this.interval!);
    }

    async search(query: Query): Promise<TextResult[]> {
        const match = query.matchAny(getAllTranslations('clipboard'), getTranslation('clipboard', config));
        return clipboard_history.map(text => ({
            module: MODULE_ID,
            query: query.text,
            kind: 'text-result',
            icon: { material: 'assignment' },
            text: text,
            quality: query.text.length > 0 ? 0.75 * Math.max(match, query.matchText(text)) : this.config.default_quality,
            autocomplete: this.config.prefix + text,
        }));
    }

    async execute(result: TextResult) {
        clipboard.writeText(result.text);
    }
}

