
import { existsSync, readFileSync, writeFileSync } from "fs";
import { app, ipcMain } from 'electron';
import { config } from '../config';
import { stringMatchQuality } from '../search';
import path from 'path';

let execute_history = [];

const HISTORY_FILENAME = 'history.json';

function loadHistory() {
    const history_path = path.join(app.getPath('userData'), HISTORY_FILENAME);
    if (existsSync(history_path)) {
        try {
            execute_history = JSON.parse(readFileSync(history_path, { encoding: 'utf8' }));
        } catch (e) { }
    }
    writeFileSync(history_path, JSON.stringify(execute_history), { encoding: 'utf8' });
}

function updateHistory() {
    const history_path = path.join(app.getPath('userData'), HISTORY_FILENAME);
    writeFileSync(history_path, JSON.stringify(execute_history), { encoding: 'utf8' });
}
    
ipcMain.on('reset-history', (_) => {
    execute_history = [];
    updateHistory();
});

const HistoryModule = {
    init: async () => {
        if (config.modules.history.active) {
            loadHistory();
        }
    },
    valid: (query) => {
        return query.trim().length == 0 || config.modules.history.searchable;
    },
    search: async (query, regex) => {
        if (query === "") {
            return execute_history.map((option) => ({
                ...option,
                quality: config.modules.history.quality
            })).sort((a, b) => b.history_frequency - a.history_frequency);
        } else {
            return execute_history.map((option, i) => {
                let quality = Math.max(
                    stringMatchQuality(query, option.primary, regex),
                    stringMatchQuality(query, option.text, regex),
                    0.75 * stringMatchQuality(query, option.secondary, regex),
                    0.5 * stringMatchQuality(query, option.html, regex)
                );
                return {
                    ...option,
                    quality: Math.min(1.0, quality + quality / (i + 1)),
                };
            }).sort((a, b) => b.history_frequency - a.history_frequency);
        }
    },
    globalExecute: async (option) => {
        if (config.modules.history.active) {
            let existing = new Set();
            execute_history.forEach((option) => {
                // Making old information less important
                option.history_frequency *= 0.99;
            });
            option.history_frequency = 1 + (option.history_frequency || 0);
            execute_history = [option].concat(execute_history).filter((el) => {
                let value = (el.type || "") + (el.text || "") + (el.primary || "") + (el.secondary || "") + (el.html || "");
                if (!existing.has(value)) {
                    existing.add(value);
                    return true;
                } else {
                    return false;
                }
            }).slice(0, config.modules.history.maximum_history);
            updateHistory();
        }
    },
}

export default HistoryModule;
