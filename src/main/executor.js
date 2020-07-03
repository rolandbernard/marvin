
import { config } from "./config";
import SettingsModule from "./modules/settings";
import MarvinQuoteModule from "./modules/marvin-quote";
import LinuxSystemModule from './modules/linux-system';
import AsyncLock from "async-lock";
import FoldersModule from "./modules/folders";

const modules = {
    marvin_quote: MarvinQuoteModule,
    settings: SettingsModule,
    linux_system: LinuxSystemModule,
    folders: FoldersModule,
};

let last_query_timeout = null;

export function initModules() {
    Object.values(modules).forEach((module) => module.init && module.init());
}

export function deinitModules() {
    Object.values(modules).forEach((module) => module.deinit && module.deinit());
}

export function searchQuery(query, callback) {
    return new Promise((resolve) => {
        clearTimeout(last_query_timeout);
        last_query_timeout = setTimeout(async () => {
            let results = [];
            let lock = new AsyncLock();
            await Promise.all(Object.keys(modules).filter((id) => modules[id].valid(query)).map((id) => {
                return new Promise((resolve) => lock.acquire('results', async () => {
                    let result = (await modules[id].search(query));
                    results = results
                        .concat(result.map((option) => ({ ...option, module: id })))
                        .filter((option) => option.quality > 0)
                        .sort((a, b) => b.quality - a.quality)
                        .slice(0, config.general.max_results);
                    // callback(results);
                    resolve();
                }));
            }));
            callback(results);
            resolve();
        }, config.general.debounce_time);
    });
}

export async function executeOption(option) {
    await modules[option.module].execute(option);
}
