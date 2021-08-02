
import { clipboard } from 'electron';
import fetch from 'node-fetch';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';
import { innerText, parseHtml, selectAll } from 'common/html';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';

const API_ROOT = 'https://www.linguee.com';

const LANGUAGES: Record<string, string> = {
    "bg": "bulgarian",
    "cs": "czech",
    "da": "danish",
    "de": "german",
    "el": "greek",
    "en": "english",
    "es": "spanish",
    "et": "estonian",
    "fi": "finnish",
    "fr": "french",
    "hu": "hungarian",
    "it": "italian",
    "ja": "japanese",
    "lt": "lithuanian",
    "lv": "latvian",
    "mt": "maltese",
    "nl": "dutch",
    "pl": "polish",
    "pt": "portuguese",
    "ro": "romanian",
    "ru": "russian",
    "sk": "slovak",
    "sl": "slovene",
    "sv": "swedish",
    "zh": "chinese",
};

interface Translation {
    original: string;
    translated: string;
    type?: string;
}

const MODULE_ID = 'translate';

interface TranslateResult extends SimpleResult {
    module: typeof MODULE_ID;
    translation: string;
};

class TranslateConfig extends ModuleConfig {
    @configKind('time')
    debounce_time = time(500, TimeUnit.MILLISECONDS);

    @configKind('quality')
    quality = 0.75;

    constructor() {
        super(true, 't?');
    }
}

@module(MODULE_ID)
export class TranslateModule implements Module<TranslateResult> {
    readonly configs = TranslateConfig;

    debounce?: NodeJS.Timeout;

    get config() {
        return moduleConfig<TranslateConfig>(MODULE_ID);
    }

    parseQuery(query: string): { word?: string, from?: string, to?: string } {
        const match = query.match(/^\s*(\S+)\s+(from)\s+(\S+)\s+(to)\s+(\S+)\s*$/i);
        if (match) {
            const from = match[3].toLowerCase();
            const from_language = Object.keys(LANGUAGES)
                .find(lang => lang === from || LANGUAGES[lang] === from);
            const to = match[5].toLowerCase();
            const to_language = Object.keys(LANGUAGES)
                .find(lang => lang === to || LANGUAGES[lang] === to);
            if (match[1] && from_language && to_language) {
                return {
                    word: match[1],
                    from: LANGUAGES[from_language],
                    to: LANGUAGES[to_language],
                };
            }
        }
        return { };
    }

    parseHtmlResult(text: string): Translation[] {
        const html = parseHtml(text);
        return selectAll(html, '.exact .lemma, .inexact .lemma').flatMap(meaning => {
            const original = innerText(selectAll(meaning, '.lemma_desc a')[0], true, true);
            return selectAll(meaning, '.translation').map(translation => ({
                original: original,
                translated: innerText(selectAll(translation, 'a')[0], true, true),
                type: innerText(selectAll(translation, '.tag_type')[0]?.attributes['title'], true, true),
            }))
        });
    }

    async queryApi(query: Query, word: string, from: string, to: string): Promise<TranslateResult[]> {
        try {
            const response = await fetch(`${API_ROOT}/${from}-${to}/search?query=${encodeURIComponent(word)}&ajax=1`);
            const data = await response.text();
            return this.parseHtmlResult(data).map(translation => ({
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: { material: 'translate' },
                primary: translation.type ? `[${translation.type}] ${translation.translated}` : translation.translated,
                secondary: translation.original,
                quality: this.config.quality,
                translation: translation.translated,
            }));
        } catch (e) {
            return [];
        }
    }

    async search(query: Query): Promise<TranslateResult[]> {
        clearTimeout(this.debounce!);
        if (query.text.length > 0) {
            const { word, from, to } = this.parseQuery(query.text);
            if (word && from && to) {
                return new Promise(res => {
                    this.debounce = setTimeout(() => {
                        this.queryApi(query, word, from, to)
                            .then(data => res(data))
                            .catch(() => res([]));
                    }, this.config.debounce_time)
                });
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    async execute(result: TranslateResult) {
        clipboard.writeText(result.translation);
    }
}

