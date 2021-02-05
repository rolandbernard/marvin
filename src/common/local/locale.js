
import TRANSLATION_ENGLISH from "./english";
import TRANSLATION_ITALIAN from "./italian";
import TRANSLATION_GERMAN from "./german";

export const SUPPORTED_LANGUAGES = {
    'en': 'English',
    'it': 'Italiano',
    'de': 'Deutsch',
};

const TRANSLATIONS = {
    'en': { ...TRANSLATION_ENGLISH, ...SUPPORTED_LANGUAGES },
    'it': { ...TRANSLATION_ITALIAN, ...SUPPORTED_LANGUAGES },
    'de': { ...TRANSLATION_GERMAN, ...SUPPORTED_LANGUAGES },
};

export function getTranslation(config, text) {
    if (config && config.general && config.general.language) {
        return TRANSLATIONS[config.general.language][text] || TRANSLATIONS['en'][text] || text;
    } else {
        return TRANSLATIONS['en'][text] || text;
    }
}
