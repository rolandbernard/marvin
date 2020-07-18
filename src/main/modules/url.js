
import { config } from "../config";
import { exec } from 'child_process';

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
    if(str.startsWith('https://') || str.startsWith('http://')) {
        return str;
    } else {
        return 'http://' + str;
    }
}

const UrlModule = {
    valid: (query) => {
        return config.modules.url.active && isValidUrl(query);
    },
    search: async (query) => {
        return [{
            type: 'icon_list_item',
            material_icon: 'language',
            primary: query,
            secondary: null,
            executable: true,
            quality: config.modules.url.quality,
            url: completeUrl(query),
        }];
    },
    execute: (option) => {
        return new Promise((resolve) => {
            exec(`xdg-open ${option.url}`, () => {
                resolve();
            });
        });
    },
}

export default UrlModule;
