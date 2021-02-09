
import { stringMatchQuality } from '../search';
import { config } from "../config";
import { exec } from 'child_process';
import { getTranslation } from "../../common/local/locale";

const LinuxSystemModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query, regex) => {
        return [
            {
                type: 'icon_list_item',
                material_icon: 'power_settings_new',
                primary: getTranslation(config, 'shutdown'),
                secondary: null,
                executable: true,
                quality: stringMatchQuality(query, getTranslation(config, 'shutdown'), regex),
                command: 'shutdown now',
            },
            {
                type: 'icon_list_item',
                material_icon: 'replay',
                primary: getTranslation(config, 'reboot'),
                secondary: null,
                executable: true,
                quality: stringMatchQuality(query, getTranslation(config, 'reboot'), regex),
                command: 'reboot',
            },
        ];
    },
    execute: async (option) => {
        exec(option.command);
    },
}

export default LinuxSystemModule;
