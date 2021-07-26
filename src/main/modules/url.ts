
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
    quality = 1;

    @configKind('boolean')
    url_preview = false;

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class UrlModule implements Module<UrlResult> {
    readonly configs = UrlConfig;

    get config() {
        return moduleConfig<UrlConfig>(MODULE_ID);
    }

    isValidUrl(str: string): boolean {
        const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }

    completeUrl(str: string): string {
        if (str.startsWith('https://') || str.startsWith('http://')) {
            return str;
        } else {
            return 'http://' + str;
        }
    }

    async search(query: Query): Promise<UrlResult[]> {
        if (this.isValidUrl(query.text)) {
            const url = this.completeUrl(query.text);
            return [{
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: { material: 'language' },
                primary: query.text,
                secondary: getTranslation('open_in_browser', config),
                quality: this.config.quality,
                url: url,
                preview: this.config.url_preview ? {
                    kind: 'iframe-preview',
                    url: url,
                } : undefined,
            }];
        } else {
            return [];
        }
    }

    async execute(result: UrlResult) {
        openUrl(result.url);
    }
}

