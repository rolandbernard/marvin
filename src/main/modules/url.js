
import { config } from "../config";
import { exec } from 'child_process';
import { getTranslation } from "../../common/local/locale";

function isValidUrl(str) {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function completeUrl(str) {
    if (str.startsWith('https://') || str.startsWith('http://')) {
        return str;
    } else {
        return 'http://' + str;
    }
}

const UrlModule = {
    valid: (query) => {
        return isValidUrl(query);
    },
    search: async (query) => {
        const url = completeUrl(query);
        return [{
            type: 'icon_list_item',
            material_icon: 'language',
            primary: query,
            secondary: getTranslation(config, 'open_in_browser'),
            executable: true,
            quality: config.modules.url.quality,
            url: url,
            preview: config.modules.url.url_preview && {
                type: 'iframe',
                url: url,
            },
        }];
    },
    execute: async (option) => {
        exec(`xdg-open '${option.url}'`);
    },
}

export default UrlModule;
