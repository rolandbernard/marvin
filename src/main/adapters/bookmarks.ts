
import { app } from 'electron';
import { join } from 'path';
import { readFile, readdir } from 'fs/promises';

import { decompressData } from 'common/lz4';
import { match } from 'common/util';
import { getPlatform } from 'common/platform';

const CHROMIUM_BOOKMARKS_LINUX = [
    join(app.getPath('home'), '.config/chromium'),
    join(app.getPath('home'), '.config/google-chrome'),
    join(app.getPath('home'), '.config/google-chrome-unstable'),
    join(app.getPath('home'), '.config/BraveSoftware/Brave-Browser'),
    join(app.getPath('home'), '.config/microsoft-edge-beta'),
];

export function getDefaultChromiumDirectories(): string[] {
    return match(getPlatform(), {
        'linux': CHROMIUM_BOOKMARKS_LINUX,
        'unsupported': [],
    });
}

const FIREFOX_FOLDERS_LINUX = [
    join(app.getPath('home'), '.mozilla/firefox'),
];

export function getDefaultFirefoxDirectories(): string[] {
    return match(getPlatform(), {
        'linux': FIREFOX_FOLDERS_LINUX,
        'unsupported': [],
    });
}

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

async function getChromiumBookmarks(folders: string[]): Promise<Bookmark[]> {
    const ret: Bookmark[] = []
    for (const folder of folders) {
        try {
            const file = join(folder, 'Default', 'Bookmarks');
            const bookmarks = JSON.parse(await readFile(file, { encoding: 'utf8' }));
            ret.push(...recursiveBookmarkSearch(bookmarks));
        } catch (e) { /* Ignore errors */ }
    }
    return ret;
}

async function getFirefoxBookmarks(folders: string[]): Promise<Bookmark[]> {
    const ret: Bookmark[] = []
    for (const folder of folders) {
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

export async function updateBookmarkCache(chromium_folders: string[], firefox_folders: string[]) {
    bookmarks = [
        ...(await getChromiumBookmarks(chromium_folders)),
        ...(await getFirefoxBookmarks(firefox_folders)),
    ];
}

export async function getAllBookmarks(): Promise<Bookmark[]> {
    return bookmarks;
}

