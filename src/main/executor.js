
import MarvinQuoteModule from "./modules/marvin-quote";
import { config } from "./config";

const modules = {
    marvin_quote: MarvinQuoteModule,
};

export async function searchQuery(query, callback) {
    let results = [];
    await Promise.all(Object.keys(modules).filter((id) => modules[id].valid(query)).map(async (id) => {
        results = results
            .concat((await modules[id].search(query)).map((option) => ({ ...option, module: id })))
            .sort((a, b) => b.quality - a.quality)
            .slice(0, config.general.max_results);
        callback(results);
    }));
    callback(results);
}

export async function executeOption(option) {
    await modules[option.module].execute(option);
}
