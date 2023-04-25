
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

const CHROMIUM_BOOKMARKS_WINDOWS = [
    join(app.getPath('home'), 'AppData\\Local\\Microsoft\\Edge\\User Data'),
    join(app.getPath('home'), 'AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data'),
    join(app.getPath('home'), 'AppData\\Local\\Google\\Chrome\\User Data'),
];

export function getDefaultChromiumDirectories(): string[] {
    return match(getPlatform(), {
        'linux': CHROMIUM_BOOKMARKS_LINUX,
        'win32': CHROMIUM_BOOKMARKS_WINDOWS,
        'unsupported': [],
    });
}

const FIREFOX_FOLDERS_LINUX = [
    join(app.getPath('home'), '.mozilla/firefox'),
];

const FIREFOX_FOLDERS_WINDOWS = [
    join(app.getPath('home'), 'AppData\\Roaming\\Mozilla\\Firefox\\Profiles'),
];

export function getDefaultFirefoxDirectories(): string[] {
    return match(getPlatform(), {
        'linux': FIREFOX_FOLDERS_LINUX,
        'win32': FIREFOX_FOLDERS_WINDOWS,
        'unsupported': [],
    });
}

function recursiveBookmarkSearch(bookmarks: any): Bookmark[] {
    if (bookmarks instanceof Object) {
        if (bookmarks.type === 'url') {
            return [{
                name: bookmarks.name.normalize('NFKD'),
                url: bookmarks.url,
            }];
        } else if (bookmarks.type === 'text/x-moz-place') {
            return [{
                name: bookmarks.title.normalize('NFKD'),
                url: bookmarks.uri,
                icon: bookmarks.iconuri?.startsWith('fake-favicon-uri:') ? undefined : bookmarks.iconuri,
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
                .map(file => join(folder, file, 'bookmarkbackups'));
            const files = await Promise.all(folders.map(async folder => {
                try {
                    const files = await readdir(folder);
                    return join(folder, files.sort().pop()!);
                } catch (e) {
                    return undefined;
                }
            }));
            ret.push(...(await Promise.all(files.filter(file => file).map(async file => {
                try {
                    const data = decompressData(await readFile(file!));
                    const bookmarks = JSON.parse(data.toString());
                    return recursiveBookmarkSearch(bookmarks);
                } catch (e) {
                    return [];
                }
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

