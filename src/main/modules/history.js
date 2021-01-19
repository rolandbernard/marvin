
import { existsSync, readFileSync, writeFileSync } from "fs";
import { app } from 'electron';
import { config } from '../config';
import { stringMatchQuality } from '../../common/util';
import path from 'path';

let execute_history = [];

const history_filename = 'history.json';

function loadHistory() {
    const history_path = path.join(app.getPath('userData'), history_filename);
    if (existsSync(history_path)) {
        try {
            execute_history = JSON.parse(readFileSync(history_path, { encoding: 'utf8' }));
        } catch (e) { }
    }
    writeFileSync(history_path, JSON.stringify(execute_history), { encoding: 'utf8' });
}

function updateHistory() {
    const history_path = path.join(app.getPath('userData'), history_filename);
    writeFileSync(history_path, JSON.stringify(execute_history), { encoding: 'utf8' });
}

const HistoryModule = {
    init: async () => {
        if (config.modules.history.active) {
            loadHistory();
        }
    },
    valid: (query) => {
        return query.trim().length == 0 || config.modules.history.searchable;
    },
    search: async (query) => {
        if (query === "") {
            return execute_history.map((option) => ({
                ...option,
                quality: config.modules.history.quality
            }));
        } else {
            return execute_history.map((option, i) => {
                let quality = Math.max(
                    stringMatchQuality(query, option.primary),
                    stringMatchQuality(query, option.text),
                    stringMatchQuality(query, option.html),
                    stringMatchQuality(query, option.secondary)
                );
                return {
                    ...option,
                    quality: Math.min(1.0, quality + quality / (i + 1))
                };
            });
        }
    },
    globalExecute: async (option) => {
        if (config.modules.history.active) {
            let existing = new Set();
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
