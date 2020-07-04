
import { stringMatchQuality } from "../../common/util";
import { config } from "../config";
import { stat, exists, readdir } from "fs";
import path from 'path';
import { app } from "electron";
import { exec } from "child_process";

const FoldersModule = {
    valid: (query) => {
        return config.modules.folders.active && query.length >= 1;
    },
    search: async (query) => {
        return (await Promise.all(config.modules.folders.directories.map(async (directory) => {
            try {
                return await new Promise((resolve) => {
                    exists(directory, (exist) => {
                        if(exist) {
                            let dir = query[query.length-1] === '/' ? path.join(directory, query) : path.dirname(path.join(directory, query));
                            exists(dir, (exist) => {
                                if(exist) {
                                    readdir(dir, async (_, files) => {
                                        resolve(await Promise.all(files.map((file) => new Promise((resolve) => {
                                            stat(path.join(dir, file), async (_, stats) => {
                                                let option = {
                                                    type: 'icon_list_item',
                                                    uri_icon: stats.isDirectory() ? null
                                                        : (await app.getFileIcon(path.join(dir, file))).toDataURL(),
                                                    material_icon: stats.isDirectory() ? 'folder' : null,
                                                    primary: file,
                                                    secondary: path.join(dir, file),
                                                    executable: true,
                                                    quality: query[query.length-1] === '/' ? 0.5 : stringMatchQuality(path.basename(query), file),
                                                    file: path.join(dir, file),
                                                };
                                                resolve(option);
                                            });
                                        }))));
                                    });
                                } else {
                                    resolve([]);
                                }
                            });
                        } else {
                            resolve([]);
                        }
                    });
                });
            } catch (e) { console.error(e) }
        }))).reduce((a, b) => a.concat(b));
    },
    execute: (option) => {
        return new Promise((resolve) => {
            exec(`xdg-open ${option.file}`, () => {
                resolve();
            })
        });
    },
}

export default FoldersModule;
