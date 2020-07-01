
import MarvinQuoteModule from "./modules/marvin-quote";
import { config } from "./config";
import SettingsModule from "./modules/settings";

const modules = {
    marvin_quote: MarvinQuoteModule,
    settings: SettingsModule,
};

let last_query_timeout = null;

export function searchQuery(query, callback) {
    return new Promise((resolve) => {
        clearTimeout(last_query_timeout);
        last_query_timeout = setTimeout(async () => {
            let results = [];
            await Promise.all(Object.keys(modules).filter((id) => modules[id].valid(query)).map(async (id) => {
                results = results
                    .concat((await modules[id].search(query)).map((option) => ({ ...option, module: id })))
                    .filter((option) => option.quality > 0)
                    .sort((a, b) => b.quality - a.quality)
                    .slice(0, config.general.max_results);
                callback(results);
            }));
            callback(results);
            resolve();
        }, config.general.debounce_time);
    });
}

export async function executeOption(option) {
    await modules[option.module].execute(option);
}
