
import TRANSLATION_ENGLISH from 'common/local/english';
import TRANSLATION_ITALIAN from 'common/local/italian';
import TRANSLATION_GERMAN from 'common/local/german';

import { GlobalConfig } from 'common/config';

export enum Language {
    English = 'en',
    Italian = 'it',
    German  = 'de',
}

const LANGUAGE_NAMES = {
    'en': 'English',
    'it': 'Italiano',
    'de': 'Deutsch',
}

const TRANSLATIONS = {
    'en': Object.assign(TRANSLATION_ENGLISH, LANGUAGE_NAMES),
    'it': Object.assign(TRANSLATION_ITALIAN, LANGUAGE_NAMES),
    'de': Object.assign(TRANSLATION_GERMAN, LANGUAGE_NAMES),
};

export type Translation = typeof TRANSLATIONS[Language];

export function getTranslation(text: keyof Translation, config?: GlobalConfig): string {
    return TRANSLATIONS[config?.general.language ?? 'en'][text] ?? TRANSLATIONS['en'][text] ?? text;
}

export function getAllTranslations(text: keyof Translation): string[] {
    return Object.values(Language)
        .map((lang) => TRANSLATIONS[lang][text])
        .filter(trans => trans);
}

