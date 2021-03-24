
import { generateSearchRegex, stringMatchQuality } from "../search";
import { config } from "../config";
import { stat, exists, readdir } from "fs";
import path, { extname } from 'path';
import { format } from 'url';
import { app } from "electron";
import { exec } from "child_process";

function generateFilePreview(path) {
    if (extname(path).match(/\.(pdf)/i)) {
        return {
            type: 'embed',
            url: format({
                pathname: path,
                protocol: 'file',
                slashes: true,
            }),
        };
    } else if (extname(path).match(/\.(a?png|avif|gif|jpe?g|jfif|pjp(eg)?|svg|webp|bmp|ico|cur)/i)) {
        return {
            type: 'image',
            url: format({
                pathname: path,
                protocol: 'file',
                slashes: true,
            }),
        };
    } else if (extname(path).match(/\.(mp4|webm|avi|ogv|ogm|ogg)/i)) {
        return {
            type: 'video',
            url: format({
                pathname: path,
                protocol: 'file',
                slashes: true,
            }),
        };
    } else if (extname(path).match(/\.(mp3|wav|mpeg)/i)) {
        return {
            type: 'audio',
            url: format({
                pathname: path,
                protocol: 'file',
                slashes: true,
            }),
        };
    } else {
        return null;
    }
}

const FoldersModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query) => {
        return (await Promise.all(config.modules.folders.directories.map(async (directory) => {
            const base_query = path.basename(query);
            const regex = generateSearchRegex(base_query);
            try {
                return await new Promise((resolve) => {
                    exists(directory, (exist) => {
                        if (exist) {
                            let query_dir = query[query.length - 1] === '/' ? query : path.dirname(query);
                            let dir = query[query.length - 1] === '/' ? path.join(directory, query) : path.dirname(path.join(directory, query));
                            exists(dir, (exist) => {
                                if (exist) {
                                    readdir(dir, async (_, files) => {
                                        resolve(await Promise.all(files.map((file) => new Promise((resolve) => {
                                            stat(path.join(dir, file), async (_, stats) => {
                                                let option = stats && {
                                                    type: 'icon_list_item',
                                                    uri_icon: stats.isDirectory() ? null
                                                        : (await app.getFileIcon(path.join(dir, file))).toDataURL(),
                                                    material_icon: stats.isDirectory() ? 'folder' : null,
                                                    primary: file,
                                                    secondary: path.join(dir, file),
                                                    executable: true,
                                                    complete: path.join(query_dir, file) + (stats.isDirectory() ? '/' : ''),
                                                    quality: stringMatchQuality(base_query, file, regex),
                                                    file: path.join(dir, file),
                                                    preview: config.modules.folders.file_preview && generateFilePreview(path.join(dir, file)),
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
        }))).filter((a) => a).flat();
    },
    execute: async (option) => {
        exec(`xdg-open '${option.file.replace(/\'/g, "'\\''")}'`);
    },
}

export default FoldersModule;
