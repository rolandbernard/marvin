
import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { getTranslation } from 'common/local/locale';

import { module } from 'main/modules';
import { config, moduleConfig } from 'main/config';
import { openUrl } from 'main/adapters/url-handler';

const MODULE_ID = 'url';

interface UrlResult extends SimpleResult {
    module: typeof MODULE_ID;
    url: string;
}

class UrlConfig extends ModuleConfig {
    @configKind('quality')
    quality = 0.75;

    @configKind('boolean')
    url_preview = false;

    constructor() {
        super(true);
    }
}

const URL_PATTERN = /^https?:\/\/.*$|^(\w|-)+(\.(\w|-)+)*\.[a-z]{2,}(\/.*)?$/iu;

@module(MODULE_ID)
export class UrlModule implements Module<UrlResult> {
    readonly configs = UrlConfig;

    get config() {
        return moduleConfig<UrlConfig>(MODULE_ID);
    }

    isValidUrl(str: string): boolean {
        return URL_PATTERN.test(str);
    }

    completeUrl(str: string): string {
        if (str.startsWith('https://') || str.startsWith('http://')) {
            return str;
        } else {
            return 'http://' + str;
        }
    }

    itemForUrl(query: Query, url: string): UrlResult {
        return {
            module: MODULE_ID,
            query: query.text,
            kind: 'simple-result',
            icon: { material: 'language' },
            primary: url,
            secondary: getTranslation('open_in_browser', config),
            quality: query.text === url ? 1 : this.config.quality,
            url: url,
            preview: this.config.url_preview ? {
                kind: 'iframe-preview',
                url: url,
            } : undefined,
        };
    }

    async search(query: Query): Promise<UrlResult[]> {
        if (this.isValidUrl(query.text)) {
            const url = this.completeUrl(query.text);
            return [this.itemForUrl(query, url)];
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: UrlResult): Promise<UrlResult | undefined> {
        return this.itemForUrl(query, result.url);
    }

    async execute(result: UrlResult) {
        openUrl(result.url);
    }
}

