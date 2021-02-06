
import { stringMatchQuality } from "../../common/util";
import { config } from "../config";

const HtmlModule = {
    valid: () => {
        return true;
    },
    search: async (query, regex) => {
        return config.modules.html.entries.map((entry) => ({
            type: 'html',
            html: entry.html,
            quality: query.length >= 1 ? stringMatchQuality(query, entry.name, regex) : entry.default_quality,
        }));
    },
}

export default HtmlModule;
