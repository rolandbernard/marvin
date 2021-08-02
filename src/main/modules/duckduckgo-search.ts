
import fetch from 'node-fetch';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';
import { innerText, parseHtml, selectAll } from 'common/html';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';
import { openUrl } from 'main/adapters/url-handler';

const API_ROOT = 'https://html.duckduckgo.com';

interface Result {
    title: string;
    url: string;
    icon?: string;
}

const MODULE_ID = 'duckduckgo_search';

interface DuckDuckGoResult extends SimpleResult {
    url: string;
};

class DuckDuckGoConfig extends ModuleConfig {
    @configKind('time')
    debounce_time = time(500, TimeUnit.MILLISECONDS);

    @configKind('quality')
    quality = 0.75;

    @configKind('boolean')
    url_preview = false;

    constructor() {
        super(true, 'd?');
    }
}

@module(MODULE_ID)
export class DuckDuckGoModule implements Module<DuckDuckGoResult> {
    readonly configs = DuckDuckGoConfig;

    debounce?: NodeJS.Timeout;

    get config() {
        return moduleConfig<DuckDuckGoConfig>(MODULE_ID);
    }

    completeUrl(str: string): string {
        if (str.startsWith('https://') || str.startsWith('http://')) {
            return str;
        } else {
            return `https:${str}`;
        }
    }

    parseHtmlResult(text: string): Result[] {
        const html = parseHtml(text);
        return selectAll(html, '.web-result').flatMap(result => ({
            title: innerText(selectAll(result, 'h2')[0], true, true),
            url: this.completeUrl(selectAll(result, 'a')[0]?.attributes['href']),
            icon: this.completeUrl(selectAll(result, 'img')[0]?.attributes['src']),
        }));
    }

    async queryApi(query: Query): Promise<DuckDuckGoResult[]> {
        try {
            const response = await fetch(`${API_ROOT}/html?q=${encodeURIComponent(query.text)}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0',
                }
            });
            const data = await response.text();
            return this.parseHtmlResult(data).map(result => ({
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: {
                    url: result.icon,
                    material: 'search',
                },
                primary: result.title,
                secondary: result.url,
                quality: this.config.quality,
                preview: this.config.url_preview && result.url ? {
                    kind: 'iframe-preview',
                    url: result.url,
                } : undefined,
                url: result.url,
            }));
        } catch (e) {
            return [];
        }
    }

    async search(query: Query): Promise<DuckDuckGoResult[]> {
        clearTimeout(this.debounce!);
        if (query.text.length > 0) {
            return new Promise(res => {
                this.debounce = setTimeout(() => {
                    this.queryApi(query)
                        .then(data => res(data))
                        .catch(() => res([]));
                }, this.config.debounce_time)
            });
        } else {
            return [];
        }
    }

    async rebuild(_query: Query, result: DuckDuckGoResult): Promise<DuckDuckGoResult | undefined> {
        return {
            ...result,
            quality: this.config.quality,
            preview: this.config.url_preview && result.url ? {
                kind: 'iframe-preview',
                url: result.url,
            } : undefined,
        };
    }

    async execute(result: DuckDuckGoResult) {
        openUrl(result.url);
    }
}
