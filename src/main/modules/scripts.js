
import { config } from '../config';
import { getTranslation } from '../../common/local/locale';
import { exec } from "child_process";
import { stringMatchQuality } from '../../common/util';

const ScriptsModule = {
    valid: () => {
        return true;
    },
    search: async (query) => {
        return config.modules.scripts.entries.map((entry) => ({
            type: 'icon_list_item',
            material_icon: 'account_tree',
            primary: entry.name,
            secondary: entry.script.replace(/\n/g, '; '),
            executable: true,
            quality: query.length >= 1 ? stringMatchQuality(query, entry.name) : entry.default_quality,
            script: entry.script,
        }));
    },
    execute: async (option) => {
        exec(`sh <<< "${option.script.replace(/\"/g, '\\"')}"`);
    },
}

export default ScriptsModule;
