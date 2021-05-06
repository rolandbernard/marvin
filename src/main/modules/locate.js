
import { generateSearchRegex, stringMatchQuality } from "../search";
import { config } from "../config";
import { basename, extname } from 'path';
import { exec } from "child_process";
import { app } from "electron";

function generateFilePreview(filename) {
    if (extname(filename).match(/\.(pdf)/i)) {
        return {
            type: 'embed',
            url: `file://${filename}`,
        };
    } else if (extname(filename).match(/\.(a?png|avif|gif|jpe?g|jfif|pjp(eg)?|svg|webp|bmp|ico|cur)/i)) {
        return {
            type: 'image',
            url: `file://${filename}`,
        };
    } else if (extname(filename).match(/\.(mp4|webm|avi|ogv|ogm|ogg)/i)) {
        return {
            type: 'video',
            url: `file://${filename}`,
        };
    } else if (extname(filename).match(/\.(mp3|wav|mpeg)/i)) {
        return {
            type: 'audio',
            url: `file://${filename}`,
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
            const base_query = basename(query);
            const base_regex = generateSearchRegex(base_query);
            exec(`locate -i -l ${config.modules.locate.search_limit} -e ${query}`, async (_, stdout, __) => {
                if (stdout) {
                    const files = stdout.split('\n');
                    const icons = await Promise.all(files.map(file => app.getFileIcon(file)));
                    resolve(files.map((file, i) => ({
                        type: 'icon_list_item',
                        uri_icon: icons[i].toDataURL(),
                        primary: basename(file),
                        secondary: file,
                        executable: true,
                        quality: Math.max(
                            0.5 * stringMatchQuality(query, file, regex),
                            stringMatchQuality(base_query, basename(file), base_regex)
                        ),
                        file: file,
                        preview: config.modules.locate.file_preview && generateFilePreview(file),
                    })));
                } else {
                    resolve([]);
                }
            });
        });
    },
    execute: async (option) => {
        exec(`xdg-open '${option.file.replace(/\'/g, "'\\''")}'`);
    },
}

export default LocateModule;
