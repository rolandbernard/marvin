
import { config } from "../config";
import { exec } from 'child_process';
import { getTranslation } from "../../common/local/locale";

function isValidEmail(str) {
    let pattern = new RegExp('^(mailto:)?' +
        '[^@]+@' +
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}$', 'i');
    return !!pattern.test(str);
}

function completeEmail(str) {
    if (str.startsWith('mailto:')) {
        return str;
    } else {
        return 'mailto:' + str;
    }
}

const EmailModule = {
    valid: (query) => {
        return isValidEmail(query);
    },
    search: async (query) => {
        const mailto_url = completeEmail(query);
        return [{
            type: 'icon_list_item',
            material_icon: 'drafts',
            primary: query,
            secondary: getTranslation(config, 'open_new_email'),
            executable: true,
            quality: config.modules.email.quality,
            url: mailto_url,
        }];
    },
    execute: async (option) => {
        exec(`xdg-open '${option.url.replace(/\'/g, "'\\''")}'`);
    },
}

export default EmailModule;
