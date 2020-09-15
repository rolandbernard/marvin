
import translation_english from "./english";
import translation_italian from "./italian";
import translation_german from "./german";

export const supported_languages = {
    'en': 'English',
    'it': 'Italiano',
    'de': 'Deutsch',
};

const transalations = {
    'en': translation_english,
    'it': translation_italian,
    'de': translation_german,
};

export function getTranslation(config, text) {
    if(config && config.general && config.general.language) {
        return transalations[config.general.language][text] || transalations['en'][text] || text;
    } else {
        return transalations['en'][text] || text;
    }
}
