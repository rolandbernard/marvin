
import { generateSearchRegex, stringMatchQuality } from "../../common/util";
import { config } from "../config";
import path, { extname } from 'path';
import { format } from 'url';
import { exec } from "child_process";
import { app } from "electron";

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

const LocateModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: (query, regex) => {
        return new Promise((resolve) => {
            const base_query = path.basename(query);
            const base_regex = generateSearchRegex(base_query);
            exec(`locate -i -l ${config.modules.locate.search_limit} -e ${query}`, async (_, stdout, __) => {
                if (stdout) {
                    resolve(await Promise.all(stdout.split('\n').map((file) => {
                        return new Promise(async (resolve) => {
                            let option = {
                                type: 'icon_list_item',
                                uri_icon: (await app.getFileIcon(file)).toDataURL(),
                                primary: path.basename(file),
                                secondary: file,
                                executable: true,
                                quality: Math.max(
                                    0.25 * stringMatchQuality(query, file, regex),
                                    stringMatchQuality(base_query, path.basename(file), base_regex)
                                ),
                                file: file,
                                preview: config.modules.locate.file_preview && generateFilePreview(file),
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
