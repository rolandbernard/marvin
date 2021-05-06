
import { generateSearchRegex, stringMatchQuality } from "../search";
import { config } from "../config";
import { access, stat, readdir } from "fs/promises";
import { extname, basename, dirname, join } from 'path';
import { app } from "electron";
import { exec } from "child_process";

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

const FoldersModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query) => {
        const base_query = query[query.length - 1] === '/' ? '' : basename(query);
        const query_dir = query[query.length - 1] === '/' ? query : dirname(query);
        const regex = generateSearchRegex(base_query);
        return (await Promise.all(config.modules.folders.directories.map(async (directory) => {
            try {
                await access(directory);
                const dir = join(directory, query_dir);
                const files = await readdir(dir);
                return (await Promise.all(files.map(async file => {
                    const filepath = join(dir, file);
                    const stats = await stat(filepath);
                    return {
                        type: 'icon_list_item',
                        uri_icon: stats.isDirectory() ? null : (await app.getFileIcon(filepath)).toDataURL(),
                        material_icon: stats.isDirectory() ? 'folder' : null,
                        primary: file,
                        secondary: filepath,
                        executable: true,
                        complete: join(query_dir, file) + (stats.isDirectory() ? '/' : ''),
                        quality: base_query ? stringMatchQuality(base_query, file, regex) : 0.01,
                        file: join(dir, file),
                        preview: config.modules.folders.file_preview && generateFilePreview(filepath),
                    };
                })));
            } catch (e) {
                return [];
            }
        }))).filter(a => a).flat();
    },
    execute: async (option) => {
        exec(`xdg-open '${option.file.replace(/\'/g, "'\\''")}'`);
    },
}

export default FoldersModule;
