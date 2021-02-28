
import { config } from "./config";
import MainModule from "./modules/main";
import SettingsModule from "./modules/settings";
import LinuxSystemModule from './modules/linux-system';
import AsyncLock from "async-lock";
import FoldersModule from "./modules/folders";
import HtmlModule from "./modules/html";
import CalculatorModule from "./modules/calculator";
import LinuxApplicationModule from "./modules/linux-applications";
import UrlModule from "./modules/url";
import LocateModule from "./modules/locate";
import ShortcutModule from "./modules/shortcuts";
import CommandModule from './modules/command';
import ScriptsModule from "./modules/scripts";
import ClipboardModule from "./modules/clipboard";
import DeeplModule from "./modules/deepl";
import LinuxWindowsModule from "./modules/linux-windows";
import DuckduckgoModule from "./modules/duckduckgo";
import HistoryModule from "./modules/history";
import ColorModule from "./modules/color";
import WebSearchModule from "./modules/web-search";
import AliasModule from "./modules/alias";
import CurrencyConverterModule from "./modules/currency-converter";
import DictionaryModule from "./modules/dictionary";
import BookmarksModule from "./modules/bookmarks";
import EmailModule from "./modules/email";
import { generateSearchRegex } from "./search";

const MODULES = {
    main: MainModule,
    settings: SettingsModule,
    linux_system: LinuxSystemModule,
    folders: FoldersModule,
    html: HtmlModule,
    calculator: CalculatorModule,
    linux_applications: LinuxApplicationModule,
    url: UrlModule,
    locate: LocateModule,
    shortcuts: ShortcutModule,
    command: CommandModule,
    scripts: ScriptsModule,
    clipboard: ClipboardModule,
    deepl: DeeplModule,
    linux_windows: LinuxWindowsModule,
    duckduckgo: DuckduckgoModule,
    history: HistoryModule,
    color: ColorModule,
    web_search: WebSearchModule,
    alias: AliasModule,
    currency_converter: CurrencyConverterModule,
    dictionary: DictionaryModule,
    bookmarks: BookmarksModule,
    email: EmailModule,
};

export function initModules() {
    return Promise.all(Object.values(MODULES).map((module) => module.init && module.init()));
}

export function updateModules(old_config) {
    return Promise.all(Object.values(MODULES).map((module) => module.update && module.update(old_config)));
}

export function deinitModules() {
    return Promise.all(Object.values(MODULES).map((module) => module.deinit && module.deinit()));
}

let last_query_timeout = null;
let exec_id = 0;

export function searchQuery(query, callback) {
    return new Promise((resolve) => {
        exec_id++;
        const begin_id = exec_id;
        clearTimeout(last_query_timeout);
        last_query_timeout = setTimeout(async () => {
            query = query.trim();
            let results = [];
            let lock = new AsyncLock();
            let to_eval;
            if (config.general.exclusive_module_prefix) {
                let prefix = '';
                for (const id of Object.keys(MODULES)) {
                    if (config.modules[id]?.prefix && config.modules[id].active && query.startsWith(config.modules[id].prefix)) {
                        if (config.modules[id].prefix.length > prefix.length) {
                            prefix = config.modules[id].prefix;
                        }
                    }
                }
                to_eval = Object.keys(MODULES).filter((id) => config.modules[id]?.prefix
                    ? config.modules[id].active && config.modules[id].prefix === prefix : false);
            } else {
                to_eval = Object.keys(MODULES).filter((id) => config.modules[id]?.prefix
                    ? config.modules[id].active && query.startsWith(config.modules[id].prefix) : false);
            }
            if (to_eval.length === 0) {
                to_eval = Object.keys(MODULES).filter((id) => config.modules[id]
                    ? config.modules[id].active && !config.modules[id].prefix : true);
            }
            const query_regex = generateSearchRegex(query);
            await Promise.all(
                to_eval.filter((id) => (
                    config.modules[id]?.prefix ? MODULES[id].valid(query.replace(config.modules[id].prefix, '').trim()) : MODULES[id].valid(query)
                ))
                    .map((id) => {
                        return new Promise(async (resolv) => {
                            try {
                                let result = (await MODULES[id].search(
                                    config.modules[id]?.prefix ? query.replace(config.modules[id].prefix, '').trim() : query,
                                    config.modules[id]?.prefix
                                        ? generateSearchRegex(query.replace(config.modules[id].prefix, '').trim())
                                        : query_regex
                                ));
                                await lock.acquire('results', () => {
                                    if (exec_id === begin_id) {
                                        let existing = new Set();
                                        results = results
                                            .concat(result.map((option) => ({ module: id, ...option })))
                                            .filter((option) => option.quality > 0)
                                            .sort((a, b) => b.quality - a.quality)
                                            .filter((el) => {
                                                let value = (el.type || "") + (el.text || "") + (el.primary || "") + (el.secondary || "") + (el.html || "");
                                                if (!existing.has(value)) {
                                                    existing.add(value);
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            })
                                            .slice(0, config.general.max_results)
                                        if (config.general.incremental_results && results.length > 0) {
                                            callback(results);
                                        }
                                    } else {
                                        resolve();
                                    }
                                });
                            } catch (e) {
                                console.error(e);
                            } finally {
                                resolv();
                            }
                        });
                    })
            );
            if (exec_id === begin_id) {
                callback(results);
            }
            resolve();
        }, config.general.debounce_time);
    });
}

export function executeOption(option) {
    Object.values(MODULES).forEach((module) => module.globalExecute && module.globalExecute(option));
    return MODULES[option.module].execute(option);
}
