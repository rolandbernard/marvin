
import { app } from 'electron';
import { join } from 'path';
import { readFile, readdir } from 'fs/promises';
import { decompressData } from 'common/lz4';

const CHROMIUM_BOOKMARKS = [
    join(app.getPath('home'), '.config/chromium/Default/Bookmarks'),
    join(app.getPath('home'), '.config/google-chrome/Default/Bookmarks'),
    join(app.getPath('home'), '.config/google-chrome-unstable/Default/Bookmarks'),
    join(app.getPath('home'), '.config/BraveSoftware/Brave-Browser/Default/Bookmarks'),
    join(app.getPath('home'), '.config/microsoft-edge-beta/Default/Bookmarks'),
];

const FIREFOX_FOLDERS = [
    join(app.getPath('home'), '.mozilla/firefox'),
];

function recursiveBookmarkSearch(bookmarks: any): Bookmark[] {
    if (bookmarks instanceof Object) {
        if (bookmarks.type === 'url') {
            return [{
                name: bookmarks.name,
                url: bookmarks.url,
            }];
        } else if (bookmarks.type === 'text/x-moz-place') {
            return [{
                name: bookmarks.title,
                url: bookmarks.uri,
                icon: bookmarks.iconuri,
            }];
        } else {
            let ret: Bookmark[] = [];
            Object.values(bookmarks).forEach((child) => {
                ret = ret.concat(recursiveBookmarkSearch(child));
            });
            return ret;
        }
    } else {
        return [];
    }
}

async function getChromiumBookmarks(): Promise<Bookmark[]> {
    const ret: Bookmark[] = []
    for (const file of CHROMIUM_BOOKMARKS) {
        try {
            const bookmarks = JSON.parse(await readFile(file, { encoding: 'utf8' }));
            ret.push(...recursiveBookmarkSearch(bookmarks));
        } catch (e) { /* Ignore errors */ }
    }
    return ret;
}

async function getFirefoxBookmarks(): Promise<Bookmark[]> {
    const ret: Bookmark[] = []
    for (const folder of FIREFOX_FOLDERS) {
        try {
            const folders = (await readdir(folder))
                .filter((file) => file.endsWith('.default'))
                .map((file) => join(folder, file, 'bookmarkbackups'));
            const files = await Promise.all(folders.map(async folder => {
                const files = await readdir(folder);
                return join(folder, files.sort().pop()!);
            }));
            ret.push(...(await Promise.all(files.map(async file => {
                const data = decompressData(await readFile(file));
                const bookmarks = JSON.parse(data.toString());
                return recursiveBookmarkSearch(bookmarks);
            }))).flat());
        } catch (e) { /* Ignore errors */ }
    }
    return ret;
}

export interface Bookmark {
    icon?: string;
    name: string;
    url: string;
}

let bookmarks: Bookmark[] = [];

export async function updateBookmarkCache() {
    bookmarks = [
        ...(await getChromiumBookmarks()),
        ...(await getFirefoxBookmarks()),
    ];
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
    return bookmarks;
}

