
import { config } from "./config";
import SettingsModule from "./modules/settings";
import MarvinQuoteModule from "./modules/marvin-quote";
import LinuxSystemModule from './modules/linux-system';
import AsyncLock from "async-lock";
import FoldersModule from "./modules/folders";
import HtmlModule from "./modules/html";
import CalculatorModule from "./modules/calculator";
import LinuxApplicationModule from "./modules/linux-applications";
import UrlModule from "./modules/url";

const modules = {
    marvin_quote: MarvinQuoteModule,
    settings: SettingsModule,
    linux_system: LinuxSystemModule,
    folders: FoldersModule,
    html: HtmlModule,
    calculator: CalculatorModule,
    linux_applications: LinuxApplicationModule,
    url: UrlModule,
};

let last_query_timeout = null;

export function initModules() {
    return Promise.all(Object.values(modules).map((module) => module.init && module.init()));
}

export function updateModules() {
    return Promise.all(Object.values(modules).map((module) => module.update && module.update()));
}

export function deinitModules() {
    return Promise.all(Object.values(modules).map((module) => module.deinit && module.deinit()));
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

export function executeOption(option) {
    return modules[option.module].execute(option);
}
