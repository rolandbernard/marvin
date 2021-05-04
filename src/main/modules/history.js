
import { readFile, writeFile } from "fs/promises";
import { app, ipcMain } from 'electron';
import { config } from '../config';
import { stringMatchQuality } from '../search';
import path from 'path';

let execute_history = [];

const HISTORY_FILENAME = 'history.json';

async function loadHistory() {
    const history_path = path.join(app.getPath('userData'), HISTORY_FILENAME);
    try {
        execute_history = JSON.parse(await readFile(history_path, { encoding: 'utf8' }));
    } catch (e) { }
    await writeFile(history_path, JSON.stringify(execute_history), { encoding: 'utf8' });
}

async function updateHistory() {
    const history_path = path.join(app.getPath('userData'), HISTORY_FILENAME);
    await writeFile(history_path, JSON.stringify(execute_history), { encoding: 'utf8' });
}
    
ipcMain.on('reset-history', async _ => {
    execute_history = [];
    await updateHistory();
});

const HistoryModule = {
    init: async () => {
        if (config.modules.history.active) {
            await loadHistory();
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
            })).sort((a, b) => config.modules.history.sort_by_frequency ? b.history_frequency - a.history_frequency : 0);
        } else {
            return execute_history.map((option) => {
                let quality = Math.max(
                    stringMatchQuality(query, option.primary, regex),
                    stringMatchQuality(query, option.text, regex),
                    0.75 * stringMatchQuality(query, option.secondary, regex),
                    0.5 * stringMatchQuality(query, option.html, regex)
                ) * (config.modules.history.weight_by_frequency ? (2 * Math.atan(option.history_frequency)) : 1);
                return {
                    ...option,
                    quality: Math.min(1.0, quality),
                };
            }).sort((a, b) => config.modules.history.sort_by_frequency ? b.history_frequency - a.history_frequency : 0);
        }
    },
    globalExecute: async (option) => {
        function getOptionKey(el) {
            return (el.type || "")
                + "---" + (el.text || "")
                + "---" + (el.primary || "")
                + "---" + (el.secondary || "")
                + "---" + (el.html || "");
        }
        if (config.modules.history.active) {
            let key = getOptionKey(option);
            let old_frequency = 0;
            for (let i = 0; i < execute_history.length;) {
                if (key === getOptionKey(execute_history[i])) {
                    old_frequency = execute_history[i].history_frequency;
                    execute_history.splice(i, 1);
                } else {
                    execute_history[i].history_frequency *= 0.99;
                    i++;
                }
            }
            option.history_frequency = old_frequency + 1;
            execute_history.unshift(option);
            execute_history.splice(config.modules.history.maximum_history);
            await updateHistory();
        }
    },
}

export default HistoryModule;
