
import translation_english from "./english";
import translation_italian from "./italian";
import translation_german from "./german";

export const supported_languages = {
    'en': 'English',
    'it': 'Italiano',
    'de': 'Deutsch',
};

const transalations = {
    'en': { ...translation_english, ...supported_languages },
    'it': { ...translation_italian, ...supported_languages },
    'de': { ...translation_german, ...supported_languages },
};

export function getTranslation(config, text) {
    if (config && config.general && config.general.language) {
        return transalations[config.general.language][text] || transalations['en'][text] || text;
    } else {
        return transalations['en'][text] || text;
    }
}
