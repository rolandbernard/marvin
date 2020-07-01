
import translation_english from "./english";

export const supported_languages = {
    'en': 'English',
};

const transalations = {
    'en': translation_english,
};

export function getTranslation(config, text) {
    if(config && config.general && config.general.language) {
        return transalations[config.general.language][text] || transalations['en'][text];
    } else {
        return transalations['en'][text];
    }
}
