
import { clipboard } from 'electron';
import fetch from 'node-fetch';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';

const API_ROOT = 'https://api.dictionaryapi.dev/api/v2';

const LANGUAGES: Record<string, string[]> = {
    'en': ['English', 'Inglese', 'Englisch'],
    'hi': ['Hindi'],
    'es': ['Spanish', 'Spagnolo', 'Spanisch'],
    'fr': ['French', 'Francese', 'Französisch'],
    'ja': ['Japanese', 'Giapponese', 'Japanisch'],
    'ru': ['Russian', 'Russo', 'Russisch'],
    'de': ['German', 'Tedesco', 'Deutsch'],
    'it': ['Italian', 'Italiano', 'Italienisch'],
    'ko': ['Korean'],
    'pt-BR': ['Portuguese', 'Portugiesisch', 'Portoghese'],
    'ar': ['Arabic'],
    'tr': ['Turkish'],
};

interface DictionaryApiDefinition {
    definition: string;
    synonyms?: string[];
    example: string;
}

interface DictionaryApiMeaning {
    partOfSpeech: string;
    definitions: DictionaryApiDefinition[];
}

interface DictionaryApiWord {
    word: string;
    phonetics?: {
        text: string;
        audio: string;
    }[];
    meanings: DictionaryApiMeaning[];
}

type DictionaryApiBody = DictionaryApiWord[] | undefined;

const MODULE_ID = 'dictionary';

interface DictionaryResult extends SimpleResult {
    text?: string;
}

class DictionaryConfig extends ModuleConfig {
    @configKind('time')
    debounce_time = time(500, TimeUnit.MILLISECONDS);

    @configKind('quality')
    quality = 0.75;

    constructor() {
        super(true, 'def?');
    }
}

@module(MODULE_ID)
export class DictionaryModule implements Module<DictionaryResult> {
    readonly configs = DictionaryConfig;

    debounce?: NodeJS.Timeout;

    get config() {
        return moduleConfig<DictionaryConfig>(MODULE_ID);
    }

    parseQuery(query: string): { word?: string, lang?: string } {
        const match = query.match(/^\s*(\S+)\s+(in)\s+(\S+)\s*$/i);
        if (match) {
            const from = match[3].toLowerCase();
            const language = Object.keys(LANGUAGES)
                .find(lang => lang === from || LANGUAGES[lang].some(lang => lang.toLowerCase() === from));
            if (match[1] && language) {
                return {
                    word: match[1],
                    lang: language,
                };
            }
        }
        return { };
    }

    async queryApi(query: Query, word: string, lang: string): Promise<DictionaryResult[]> {
        try {
            const response = await fetch(`${API_ROOT}/entries/${lang}/${encodeURIComponent(word)}`);
            const data: DictionaryApiBody = (await response.json()) as any;
            if (data instanceof Array) {
                return data.flatMap(word =>
                    (word.phonetics && word.phonetics.length > 0 ? [{
                        module: MODULE_ID,
                        query: query.text,
                        kind: 'simple-result',
                        icon: { material: 'library_books' },
                        primary: word.phonetics!.map(ph => ph.text).join(', '),
                        quality: this.config.quality,
                    } as DictionaryResult] : []).concat(word.meanings.flatMap(meaning =>
                        meaning.definitions.flatMap(definition => {
                            if (definition.synonyms?.length ?? 0 > 0) {
                                return definition.synonyms!.map(synonym => ({
                                    module: MODULE_ID,
                                    query: query.text,
                                    kind: 'simple-result',
                                    icon: { material: 'library_books' },
                                    primary: `[${meaning.partOfSpeech}] ${synonym}`,
                                    secondary: definition.definition,
                                    quality: this.config.quality,
                                    text: synonym,
                                }));
                            } else {
                                return [{
                                    module: MODULE_ID,
                                    query: query.text,
                                    kind: 'simple-result',
                                    icon: { material: 'library_books' },
                                    primary: `[${meaning.partOfSpeech}]`,
                                    secondary: definition.definition,
                                    quality: this.config.quality,
                                    text: definition.definition,
                                }];
                            }
                        })
                    ))
                );
            }
            return [];
        } catch (e) {
            return [];
        }
    }

    async search(query: Query): Promise<DictionaryResult[]> {
        clearTimeout(this.debounce!);
        if (query.text.length > 0) {
            const { word, lang } = this.parseQuery(query.text);
            if (word && lang) {
                return new Promise(res => {
                    this.debounce = setTimeout(() => {
                        this.queryApi(query, word, lang)
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

    async execute(result: DictionaryResult) {
        if (result.text) {
            clipboard.writeText(result.text);
        }
    }
}

