
import { config } from '../config';
import { stringMatchQuality } from '../../common/util';
import { exec } from 'child_process';

const LinuxWindowsModule = {
    valid: (query) => {
        return config.modules.linux_windows.active && query.trim().length >= 1;
    },
    search: (query) => {
        return new Promise((resolve) => {
            exec('wmctrl -x -l', async (_, stdout, __) => {
                if (stdout) {
                    resolve(stdout.split('\n').filter((line) => line)
                        .map((line) => line.split(' ').map((elm) => elm.trim()).filter((elm) => elm.length >= 1))
                        .map((line) => ({
                            type: 'icon_list_item',
                            icon_alt: (line[2].split('.')[1] || line[2]).toUpperCase(),
                            primary: line.slice(4).join(' '),
                            secondary: line[2],
                            executable: true,
                            quality: Math.max(stringMatchQuality(query, line.slice(4).join(' ')), stringMatchQuality(query, line[2])),
                            id: line[0],
                        })));
                } else {
                    resolve([]);
                }
            });
        });
    },
    execute: async (option) => {
        exec(`wmctrl -i -a ${option.id}`);
    },
}

export default LinuxWindowsModule;