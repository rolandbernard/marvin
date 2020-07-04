
import { stringMatchQuality } from "../../common/util";
import { config } from "../config";

const HtmlModule = {
    valid: () => {
        return config.modules.html.active;
    },
    search: async (query) => {
        return config.modules.html.entries.map((entry) => ({
            type: 'html',
            html: entry.html,
            quality: query.length >= 1 ? stringMatchQuality(query, entry.name) : entry.default_quality,
        }));
    },
}

export default HtmlModule;