
import { stringMatchQuality } from "../search";
import { config } from "../config";

const AliasModule = {
    valid: () => {
        return true;
    },
    search: async (query, regex) => {
        if (config.modules.alias.prefix_text) {
            return config.modules.alias.aliases.filter((entry) => entry.option).map((entry) => ({
                ...entry.option,
                primary: (entry.name + ': ' + entry.option.primary),
                text: (entry.name + ': ' + entry.option.text),
                quality: query.length >= 1 ? stringMatchQuality(query, entry.name, regex) : entry.default_quality,
            }));
        } else {
            return config.modules.alias.aliases.map((entry) => ({
                ...entry.option,
                quality: query.length >= 1 ? stringMatchQuality(query, entry.name, regex) : entry.default_quality,
            }));
        }
    },
}

export default AliasModule;
