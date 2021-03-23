
import { config } from "../config";
import { exec } from 'child_process';
import { getTranslation } from "../../common/local/locale";

const WebSearchModule = {
    valid: (query) => {
        return config.modules.web_search.patterns.reduce((acc, pat) => acc || (query.startsWith(pat.prefix) && pat.prefix.length < query.length), false);
    },
    search: async (query) => {
        return config.modules.web_search.patterns.filter(pattern => query.startsWith(pattern.prefix) && pattern.prefix.length < query.length).map(pattern => {
            const sub_query = query.replace(pattern.prefix, '').trim();
            const url = pattern.url_pattern.replaceAll('$', sub_query);
            return {
                type: 'icon_list_item',
                material_icon: 'search',
                primary: url,
                secondary: getTranslation(config, 'open_in_browser'),
                executable: true,
                quality: config.modules.web_search.quality,
                url: url,
                preview: config.modules.url.url_preview && {
                    type: 'iframe',
                    url: url,
                },
            }
        });
    },
    execute: async (option) => {
        exec(`xdg-open '${option.url}'`);
    },
}

export default WebSearchModule;
