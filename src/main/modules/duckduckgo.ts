
import { clipboard } from 'electron';
import fetch from 'node-fetch';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult, TextResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';
import { openUrl } from 'main/adapters/url-handler';

const API_ROOT = 'https://api.duckduckgo.com';
const IMAGE_ROOT = 'https://duckduckgo.com';

interface DuckDuckGoApiTopic {
    Result: string;
    FirstURL?: string;
    Icon: {
        URL?: string;
        Height?: number;
        Width?: number;
    };
    Text: string;
}

interface DuckDuckGoApiCategory {
    Name: string;
    Topics: DuckDuckGoApiItem[];
}

type DuckDuckGoApiItem = DuckDuckGoApiTopic | DuckDuckGoApiCategory;

function isCategory(item: DuckDuckGoApiItem): item is DuckDuckGoApiCategory {
    return (item as any).Topics;
}

interface DuckDuckGoApiBody {
    Abstract?: string;
    AbstractText?: string;
    AbstractSource?: string;
    AbstractURL?: string;
    Image?: string;
    Heading?: string;

    Answer?: string;
    AnswerType?: 'calc' | 'color' | 'digest' | 'info' | 'ip' | 'iploc' | 'phone' | 'pw' | 'rand' | 'regexp' | 'unicode' | 'upc' | 'zip';

    Definition?: string;
    DefinitionSource?: string;
    DefinitionURL?: string;

    RelatedTopics: DuckDuckGoApiItem[];

    Results: DuckDuckGoApiItem[];

    Type?: 'A' | 'D' | 'C' | 'N' | 'E';

    Redirect?: string;
};

const MODULE_ID = 'duckduckgo';

type DuckDuckGoResult = (SimpleResult | TextResult) & { url?: string, text?: string };

class DuckDuckGoConfig extends ModuleConfig {
    @configKind('time')
    debounce_time = time(500, TimeUnit.MILLISECONDS);

    @configKind('quality')
    quality = 0.75;

    @configKind('boolean')
    url_preview = false;

    constructor() {
        super(true, 'a?');
    }
}

@module(MODULE_ID)
export class DuckDuckGoModule implements Module<DuckDuckGoResult> {
    readonly configs = DuckDuckGoConfig;

    debounce?: NodeJS.Timeout;

    get config() {
        return moduleConfig<DuckDuckGoConfig>(MODULE_ID);
    }

    async queryApi(query: Query): Promise<DuckDuckGoResult[]> {
        try {
            const response = await fetch(`${API_ROOT}/?q=${encodeURIComponent(query.text)}&format=json&no_redirect=1`);
            const data: DuckDuckGoApiBody = (await response.json()) as any;
            const results: DuckDuckGoResult[] = [];
            if (data.Redirect) {
                results.push({
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: { material: 'language' },
                    primary: query.text,
                    secondary: data.Redirect,
                    quality: this.config.quality,
                    url: data.Redirect,
                    preview: this.config.url_preview ? {
                        kind: 'iframe-preview',
                        url: data.Redirect,
                    } : undefined,
                });
            }
            if (data.Answer) {
                results.push({
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'text-result',
                    icon: { material: 'assessment' },
                    text: data.Answer,
                    quality: this.config.quality,
                });
            }
            if (data.Definition) {
                results.push({
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'text-result',
                    icon: { material: 'assessment' },
                    text: data.Definition,
                    quality: this.config.quality,
                    url: data.DefinitionURL,
                    preview: this.config.url_preview && data.DefinitionURL ? {
                        kind: 'iframe-preview',
                        url: data.DefinitionURL,
                    } : undefined,
                });
            }
            if (data.AbstractText) {
                results.push({
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'text-result',
                    icon: {
                        url: (data.Image?.[0] === '/' ? `${IMAGE_ROOT}/${data.Image}` : data.Image),
                        material: 'assessment',
                    },
                    text: data.AbstractText,
                    quality: this.config.quality,
                    url: data.AbstractURL,
                    preview: this.config.url_preview && data.AbstractURL ? {
                        kind: 'iframe-preview',
                        url: data.AbstractURL,
                    } : undefined,
                });
            }
            const items = data.Results.concat(data.RelatedTopics);
            const resultsForItems = (items: DuckDuckGoApiItem[]) => {
                for (const result of items) {
                    if (isCategory(result)) {
                        resultsForItems(result.Topics);
                    } else {
                        results.push({
                            module: MODULE_ID,
                            query: query.text,
                            kind: 'text-result',
                            icon: {
                                url: (result.Icon.URL?.[0] === '/' ? `${IMAGE_ROOT}/${result.Icon.URL}` : result.Icon.URL),
                                material: 'assessment',
                            },
                            text: result.Text,
                            quality: this.config.quality,
                            url: result.FirstURL,
                            preview: this.config.url_preview && result.FirstURL ? {
                                kind: 'iframe-preview',
                                url: result.FirstURL,
                            } : undefined,
                        });
                    }
                }
            };
            resultsForItems(items);
            return results;
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
        if (result.url) {
            openUrl(result.url);
        } else if (result.text) {
            clipboard.writeText(result.text);
        }
    }
}

