
import { stringMatchQuality } from "../../common/util";
import { config } from "../config";
import { stat, exists, readdir } from "fs";
import path from 'path';
import { exec } from "child_process";
import { app } from "electron";

const LocateModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: (query) => {
        return new Promise((resolve) => {
            exec(`locate -i -e -b ${query}`, async (_, stdout, __) => {
                if(stdout) {
                    resolve(await Promise.all(stdout.split('\n').map((file) => {
                        return new Promise(async (resolve) => {
                            let option = {
                                type: 'icon_list_item',
                                uri_icon: (await app.getFileIcon(file)).toDataURL(),
                                primary: path.basename(file),
                                secondary: file,
                                executable: true,
                                quality: query[query.length - 1] === '/' ? 0.25 : 0.5 * stringMatchQuality(path.basename(query), path.basename(file)),
                                file: file,
                            };
                            resolve(option);
                        });
                    })));
                } else {
                    resolve([]);
                }
            });
        });
    },
    execute: async (option) => {
        exec(`xdg-open ${option.file}`);
    },
}

export default LocateModule;