
import TRANSLATION_ENGLISH from 'common/local/english';
import TRANSLATION_ITALIAN from 'common/local/italian';
import TRANSLATION_GERMAN from 'common/local/german';

import TRANSLATION_COMMON from 'common/local/common';

import { GlobalConfig } from 'common/config';

export enum Language {
    English = 'en',
    Italian = 'it',
    German  = 'de',
}

const TRANSLATIONS = {
    'en': Object.assign(TRANSLATION_ENGLISH, TRANSLATION_COMMON),
    'it': Object.assign(TRANSLATION_ITALIAN, TRANSLATION_COMMON),
    'de': Object.assign(TRANSLATION_GERMAN, TRANSLATION_COMMON),
};

export type Translation = typeof TRANSLATIONS[Language];

export type Translatable = keyof Translation;

export function getTranslation(text: Translatable, config?: GlobalConfig): string {
    const lang_preference: Language = config?.general.language ?? Language.English;
    return TRANSLATIONS[lang_preference][text] ?? TRANSLATIONS['en'][text] ?? text;
}

export function hasTranslation(text?: string, config?: GlobalConfig): text is Translatable {
    const lang_preference: Language = config?.general.language ?? Language.English;
    return (text && TRANSLATIONS[lang_preference][text as Translatable]) ? true : false;
}

export function getAllTranslations(text: keyof Translation): string[] {
    return Object.values(Language)
        .map((lang) => TRANSLATIONS[lang][text])
        .filter(trans => trans);
}

