
import { Config, config as configDesc, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { getTranslation } from 'common/local/locale';

import { module } from 'main/modules';
import { config, moduleConfig } from 'main/config';
import { openUrl } from 'main/adapters/url-handler';

const MODULE_ID = 'web_search';

interface WebSearchResult extends SimpleResult {
    module: typeof MODULE_ID;
    url: string;
}

class WebSearchEntry extends Config {
    @configKind('text')
    prefix: string;

    @configKind('text')
    url_pattern: string;

    constructor(prefix = '', url_pattern = '') {
        super();
        this.prefix = prefix;
        this.url_pattern = url_pattern;
    }
}

class WebSearchConfig extends ModuleConfig {
    @configKind('quality')
    quality = 1;

    @configKind('boolean')
    url_preview = false;

    @configDesc({ kind: 'array', default: new WebSearchEntry() })
    patterns = [
        new WebSearchEntry('d?', 'https://duckduckgo.com/?q=$'),
        new WebSearchEntry('g?', 'https://www.google.com/search?q=$'),
        new WebSearchEntry('b?', 'https://www.bing.com/search?q=$'),
        new WebSearchEntry('w?', 'https://en.wikipedia.org/wiki/Special:Search?search=$'),
        new WebSearchEntry('s?', 'https://stackoverflow.com/search?q=$'),
    ];

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class WebSearchModule implements Module<WebSearchResult> {
    readonly configs = WebSearchConfig;

    get config() {
        return moduleConfig<WebSearchConfig>(MODULE_ID);
    }

    itemForUrl(query: Query, url: string): WebSearchResult {
        return {
            module: MODULE_ID,
            query: query.text,
            kind: 'simple-result',
            icon: { material: 'search' },
            primary: url,
            secondary: getTranslation('open_in_browser', config),
            quality: this.config.quality,
            url: url,
            preview: this.config.url_preview ? {
                kind: 'iframe-preview',
                url: url,
            } : undefined,
        };
    }

    async search(query: Query): Promise<WebSearchResult[]> {
        return this.config.patterns
            .filter(pattern => query.text.startsWith(pattern.prefix))
            .filter(pattern => pattern.prefix.length < query.text.length)
            .map(pattern => {
                const sub_query = query.text.replace(pattern.prefix, '').trim();
                const url = pattern.url_pattern.replaceAll('$', encodeURIComponent(sub_query));
                return this.itemForUrl(query, url);
            });
    }

    async rebuild(query: Query, result: WebSearchResult): Promise<WebSearchResult | undefined> {
        return this.itemForUrl(query, result.url);
    }

    async execute(result: WebSearchResult) {
        openUrl(result.url);
    }
}

