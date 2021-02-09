
import { config } from '../config';
import { getTranslation } from '../../common/local/locale';
import { exec } from "child_process";

const CommandModule = {
    valid: (query) => {
        return query.length >= 1;
    },
    search: async (query) => {
        return [
            {
                type: 'icon_list_item',
                material_icon: 'code',
                primary: query,
                secondary: getTranslation(config, 'execute_in_terminal') + ': `' + query + '`',
                executable: true,
                quality: config.modules.command.quality,
                command: `xterm -e '${query.replace(/\'/g, "'\\''")}'`,
            },
            {
                type: 'icon_list_item',
                material_icon: 'code',
                primary: query,
                secondary: getTranslation(config, 'execute') + ': `' + query + '`',
                executable: true,
                quality: config.modules.command.quality,
                command: query,
            },
        ];
    },
    execute: async (option) => {
        exec(option.command);
    },
}

export default CommandModule;
