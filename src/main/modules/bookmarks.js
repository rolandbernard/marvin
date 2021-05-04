
import { stringMatchQuality } from "../search";
import { config } from "../config";
import { exec } from 'child_process';
import { getAllTranslation, getTranslation } from "../../common/local/locale";
import { Database, OPEN_READONLY } from 'sqlite3';
import { readFile, access, readdir } from 'fs/promises';
import { join } from 'path';
import { app } from 'electron';
import { decompressBlock } from 'lz4js';

function recursiveBookmarkSearch(bookmarks) {
    if (bookmarks instanceof Object) {
        if (bookmarks.type === 'url') {
            return [{
                title: bookmarks.name,
                url: bookmarks.url,
            }];
        } else if (bookmarks.type === 'text/x-moz-place') {
            return [{
                title: bookmarks.title,
                url: bookmarks.uri,
                icon: bookmarks.iconuri,
            }];
        } else {
            let ret = [];
            Object.values(bookmarks).forEach((child) => {
                ret = ret.concat(recursiveBookmarkSearch(child));
            });
            return ret;
        }
    } else {
        return [];
    }
}

async function getChromiumBookmarks() {
    const files = [
        join(app.getPath('home'), '.config/chromium/Default/Bookmarks'),
        join(app.getPath('home'), '.config/google-chrome/Default/Bookmarks'),
    ];
    let ret = []
    for (const file of files) {
        try {
            const bookmarks = JSON.parse(await readFile(file, { encoding: 'utf8' }));
            ret = ret.concat(recursiveBookmarkSearch(bookmarks));
        } catch (e) { /* Ignore errors */ }
    }
    return ret;
}

async function getMidoriBookmarks() {
    const files = [
        join(app.getPath('home'), '.config/midori/bookmarks.db'),
    ];
    return (await Promise.all(files.map(async file => {
        try {
            await access(file);
            return await new Promise((res) => {
                const db = new Database(file, OPEN_READONLY, (err) => {
                    if (err) {
                        res([]);
                    } else {
                        db.all(`
                            Select title, uri url
                                From bookmarks;
                        `, (err, rows) => {
                            if (err) {
                                return res([]);
                            } else {
                                return res(rows);
                            }
                        });
                    }
                    db.close();
                });
            });
        } catch (e) {
            return [];
        }
    }))).flat();
}

async function getFirefoxBookmarks() {
    const firefox_dir = join(app.getPath('home'), '.mozilla/firefox');
    try {
        access(firefox_dir);
        const folders = (await readdir(firefox_dir))
            .filter((file) => file.endsWith('.default'))
            .map((file) => join(firefox_dir, file, 'bookmarkbackups'));
        const files = await Promise.all(folders.map(async folder => {
            const files = await readdir(folder);
            return join(folder, files.sort().pop())
        }))
        return (await Promise.all(files.map(async file => {
            const data = await readFile(file);
            const decompressed = Buffer.alloc(data.readUInt32LE(8));
            decompressBlock(data, decompressed, 12, data.length - 12, 0);
            const bookmarks = JSON.parse(decompressed.toString());
            return recursiveBookmarkSearch(bookmarks);
        }))).flat();
    } catch (e) {
        return [];
    }
}

const BookmarksModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query, regex) => {
        const language = config.general.language;
        const bookmarks = [
            ...(await getChromiumBookmarks()),
            ...(await getMidoriBookmarks()),
            ...(await getFirefoxBookmarks())
        ];
        const bookmark_match = Math.max(...(
            getAllTranslation('bookmarks').map(([trans, lang]) => (lang === language ? 1 : 0.5) * stringMatchQuality(query, trans, regex))
        ));
        return bookmarks.map((bookmark) => ({
            type: 'icon_list_item',
            uri_icon: bookmark.icon,
            material_icon: 'bookmark',
            primary: bookmark.title,
            secondary: getTranslation(config, 'open_in_browser') + ': ' + bookmark.url,
            executable: true,
            quality: Math.max(
                stringMatchQuality(query, bookmark.title, regex),
                stringMatchQuality(query, bookmark.title, regex),
                bookmark_match
            ),
            url: bookmark.url,
            preview: config.modules.bookmarks.url_preview && {
                type: 'iframe',
                url: bookmark.url,
            },
        }));
    },
    execute: async (option) => {
        exec(`xdg-open '${option.url.replace(/\'/g, "'\\''")}'`);
    },
}

export default BookmarksModule;
