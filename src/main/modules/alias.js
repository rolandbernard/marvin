
import { stringMatchQuality } from "../../common/util";
import { config } from "../config";

const AliasModule = {
    valid: () => {
        return true;
    },
    search: async (query) => {
        if (config.modules.alias.prefix_text) {
            return config.modules.alias.aliases.map((entry) => ({
                ...entry.option,
                primary: (entry.name + ': ' + entry.option.primary),
                text: (entry.name + ': ' + entry.option.text),
                quality: query.length >= 1 ? stringMatchQuality(query, entry.name) : entry.default_quality,
            }));
        } else {
            return config.modules.alias.aliases.map((entry) => ({
                ...entry.option,
                quality: query.length >= 1 ? stringMatchQuality(query, entry.name) : entry.default_quality,
            }));
        }
    },
}

export default AliasModule;
