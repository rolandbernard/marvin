
import { app, ipcMain } from 'electron';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { getResultKey, Result } from 'common/result';
import { Module } from 'common/module';
import { IpcChannels } from 'common/ipc';

import { module, moduleForId } from 'main/modules';
import { moduleConfig } from 'main/config';

const HISTORY_FILENAME = 'history.json';
const HISTORY_PATH = join(app.getPath('userData'), HISTORY_FILENAME);

let loaded = false;
let history: HistoryResult[] = [];

async function loadHistory() {
    if (!loaded) {
        try {
            history = JSON.parse(await readFile(HISTORY_PATH, { encoding: 'utf8' }));
            loaded = true;
        } catch (e) { }
    }
}

async function updateHistory() {
    await writeFile(HISTORY_PATH, JSON.stringify(history), { encoding: 'utf8' });
}

const MODULE_ID = 'history';

type HistoryResult = Result & { history_frequency?: number };

class HistoryConfig extends ModuleConfig {
    @configKind('boolean')
    searchable = true;

    @configKind('quality')
    default_quality = 0.5;

    @configKind('amount')
    maximum_history = 1000;

    @configKind('boolean')
    sort_by_frequency = false;

    @configKind('boolean')
    weight_by_frequency = true;

    constructor() {
        super(true);
        this.addConfigField({
            kind: 'button',
            name: 'clear_history',
            action: IpcChannels.RESET_HISTORY,
            confirm: true,
        });
    }
}

ipcMain.on(IpcChannels.RESET_HISTORY, () => {
    history = [];
    updateHistory();
});

@module(MODULE_ID)
export class ClipboardModule implements Module<HistoryResult> {
    readonly configs = HistoryConfig;

    get config() {
        return moduleConfig<HistoryConfig>(MODULE_ID);
    }

    async init() {
        if (this.config.active) {
            await loadHistory();
        }
    }

    async rebuildResult(query: Query, result: HistoryResult): Promise<Result | undefined> {
        const module = moduleForId(result.module);
        if (module) {
            if (module.rebuild) {
                try {
                    return await module.rebuild(query, result);
                } catch (e) {
                    return result;
                }
            } else {
                return result;
            }
        }
    }

    async search(query: Query): Promise<HistoryResult[]> {
        if (query.text.length > 0) {
            return (await Promise.all(history.map(async option => {
                const rebuild = await this.rebuildResult(query, option);
                if (rebuild) {
                    let quality = 0.5 * rebuild.quality * query.matchAny([
                        (query as any).text ?? '',
                        (option as any).text ?? '',
                        (option as any).primary ?? '',
                        (option as any).secondary ?? ''
                    ])
                    if (this.config.weight_by_frequency) {
                        quality *= 2 * Math.atan(option.history_frequency!);
                    }
                    return [{
                        ...rebuild,
                        query: query.text,
                        quality: Math.min(1.0, quality),
                        history_frequency: option.history_frequency,
                    }];
                } else {
                    return [];
                }
            }))).flat().sort((a, b) =>
                this.config.sort_by_frequency ? b.history_frequency! - a.history_frequency! : 0
            );
        } else if (this.config.default_quality > 0) {
            return (await Promise.all(history.map(async option => {
                const rebuild = await this.rebuildResult(query, option);
                if (rebuild) {
                    return [{
                        ...rebuild,
                        query: query.text,
                        quality: this.config.default_quality,
                        history_frequency: option.history_frequency,
                    }];
                } else {
                    return [];
                }
            }))).flat().sort((a, b) =>
                this.config.sort_by_frequency ? b.history_frequency! - a.history_frequency! : 0
            );
        } else {
            return [];
        }
    }

    async executeAny(result: HistoryResult) {
        if (this.config.active) {
            let key = getResultKey(result);
            let old_frequency = 0;
            for (let i = 0; i < history.length;) {
                if (key === getResultKey(history[i])) {
                    old_frequency = history[i].history_frequency ?? 0;
                    history.splice(i, 1);
                } else {
                    history[i].history_frequency! *= 0.99;
                    i++;
                }
            }
            result.history_frequency = old_frequency + 1;
            history.unshift(result);
            history.splice(this.config.maximum_history);
            await updateHistory();
        }
    }
}

