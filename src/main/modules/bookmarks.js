
import { stringMatchQuality } from "../../common/util";
import { config } from "../config";
import { exec } from 'child_process';
import { getTranslation } from "../../common/local/locale";
import { Database, OPEN_READONLY } from 'sqlite3';
import { readFileSync, existsSync, readdirSync } from 'fs';
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
    ].filter((file) => existsSync(file));
    let ret = []
    for (const file of files) {
        const bookmarks = JSON.parse(readFileSync(file, { encoding: 'utf8' }));
        ret = ret.concat(recursiveBookmarkSearch(bookmarks));
    }
    return ret;
}

async function getMidoriBookmarks() {
    const files = [
        join(app.getPath('home'), '.config/midori/bookmarks.db'),
    ].filter((file) => existsSync(file));
    return (await Promise.all(files.map((file) => {
        return new Promise((res) => {
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
    }))).flat();
}

async function getFirefoxBookmarks() {
    const firefox_dir = join(app.getPath('home'), '.mozilla/firefox');
    if (existsSync(firefox_dir)) {
        const files = readdirSync(firefox_dir)
            .filter((file) => file.endsWith('.default'))
            .map((file) => join(firefox_dir, file, 'bookmarkbackups'))
            .filter((file) => existsSync(file))
            .flatMap((folder) => {
                const files = readdirSync(folder);
                if (files.length > 0) {
                    return join(folder, files.sort().pop())
                } else {
                    return null;
                }
            }).filter((file) => file);
        return (await Promise.all(files.map((file) => {
            return new Promise((res) => {
                const data = readFileSync(file);
                const decompressed = Buffer.alloc(data.readUInt32LE(8));
                decompressBlock(data, decompressed, 12, data.length - 12, 0);
                const bookmarks = JSON.parse(decompressed.toString());
                res(recursiveBookmarkSearch(bookmarks));
            });
        }))).flat();
    } else {
        return [];
    }
}

const BookmarksModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query) => {
        const bookmarks = [
            ...(await getChromiumBookmarks()),
            ...(await getMidoriBookmarks()),
            ...(await getFirefoxBookmarks())
        ];
        const bookmark_match = stringMatchQuality(query, getTranslation(config, 'bookmarks'));
        return bookmarks.map((bookmark) => ({
            type: 'icon_list_item',
            material_icon: 'bookmark',
            primary: bookmark.title,
            secondary: getTranslation(config, 'open_in_browser') + ': ' + bookmark.url,
            executable: true,
            quality: Math.max(
                stringMatchQuality(query, bookmark.title),
                stringMatchQuality(query, bookmark.title),
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
        exec(`xdg-open ${option.url}`);
    },
}

export default BookmarksModule;
