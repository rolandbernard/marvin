
import { config as configDesc, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { getAllTranslations, getTranslation } from 'common/local/locale';

import { module } from 'main/modules';
import { config, moduleConfig } from 'main/config';
import { openUrl } from 'main/adapters/url-handler';
import { getAllBookmarks, getDefaultChromiumDirectories, getDefaultFirefoxDirectories, updateBookmarkCache } from 'main/adapters/bookmarks';
import { getDefaultPath } from 'main/adapters/file-handler';

const MODULE_ID = 'bookmarks';

interface BookmarkResult extends SimpleResult {
    module: typeof MODULE_ID;
    url: string;
}

class BookmarkConfig extends ModuleConfig {
    @configKind('quality')
    default_quality = 0;

    @configKind('boolean')
    url_preview = false;

    @configDesc({ kind: 'array', base: { kind: 'path', name: 'path' }, default: getDefaultPath() })
    chromium_directories = getDefaultChromiumDirectories();

    @configDesc({ kind: 'array', base: { kind: 'path', name: 'path' }, default: getDefaultPath() })
    firefox_directories = getDefaultFirefoxDirectories();

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class BookmarkModule implements Module<BookmarkResult> {
    readonly configs = BookmarkConfig;

    last_load?: number;

    get config() {
        return moduleConfig<BookmarkConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<BookmarkResult[]> {
        if (!this.last_load || (Date.now() - this.last_load) > 10000) {
            updateBookmarkCache(this.config.chromium_directories, this.config.firefox_directories);
            this.last_load = Date.now();
        }
        if (query.text.length > 0) {
            const match = query.matchAny(getAllTranslations('bookmarks'), getTranslation('bookmarks', config));
            return (await getAllBookmarks()).map(bookmark => ({
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: {
                    url: bookmark.icon,
                    material: 'bookmark',
                },
                primary: bookmark.name,
                secondary: `${getTranslation('open_in_browser', config)}: ${bookmark.url}`,
                quality: Math.max(match, query.matchAny([bookmark.name, bookmark.url])),
                autocomplete: this.config.prefix + bookmark.name,
                url: bookmark.url,
                preview: this.config.url_preview ? {
                    kind: 'iframe-preview',
                    url: bookmark.url,
                } : undefined,
            } as BookmarkResult));
        } else {
            return [];
        }
    }

    async execute(result: BookmarkResult) {
        openUrl(result.url);
    }
}

