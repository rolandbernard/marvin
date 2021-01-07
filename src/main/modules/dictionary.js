
import { clipboard } from 'electron';
import { config } from "../config";
import fetch from 'node-fetch';

let last_search = null;

let languages = {
    'en': [ 'English', 'Inglese', 'Englisch' ],
    'hi': [ 'Hindi' ],
    'es': [ 'Spanish', 'Spagnolo', 'Spanisch' ],
    'fr': [ 'French', 'Francese', 'Französisch' ],
    'ja': [ 'Japanese', 'Giapponese', 'Japanisch' ],
    'ru': [ 'Russian', 'Russo', 'Russisch' ],
    'de': [ 'German', 'Tedesco', 'Deutsch' ],
    'it': [ 'Italian', 'Italiano', 'Italienisch' ],
    'ko': [ 'Korean' ],
    'pt-BR': [ 'Portuguese', 'Portugiesisch', 'Portoghese' ],
    'ar': [ 'Arabic' ],
    'tr': [ 'Turkish' ],
};

const DictionaryModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query) => {
        let lang = config.general.language;
        const to = query.toLowerCase().lastIndexOf(' in ');
        if (to > 0) {
            const lang_part = query.substr(to + 4).toLowerCase().trim();
            const lang_id = Object.keys(languages).find((l) => l.toLowerCase() === lang_part || languages[l].find((n) => n.toLowerCase() === lang_part));
            if (lang_id) {
                query = query.substr(0, to).trim();
                lang = lang_id;
            }
        }
        clearTimeout(last_search);
        return new Promise((resolve) => {
            last_search = setTimeout(() => {
                let phon = false;
                fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURIComponent(query)}`).then((response) => {
                    response.json().then((data) => {
                        if (data instanceof Array) {
                            resolve(data.map((word) => {
                                return word.meanings.map((meaning) => {
                                    return meaning.definitions.map((definition) => {
                                        let primary = '[' + meaning.partOfSpeech + ']';
                                        if (definition.synonyms) {
                                            primary += ' - ' + definition.synonyms.join(', ');
                                        } else if (word.phonetics && !phon) {
                                            primary += ' (' + word.phonetics.map((pho) => pho.text).join(', ') + ')';
                                            phon = true;
                                        }
                                        let secondary = definition.definition;
                                        return {
                                            type: 'icon_list_item',
                                            material_icon: 'library_books',
                                            primary: primary,
                                            secondary: secondary,
                                            executable: true,
                                            quality: config.modules.dictionary.quality,
                                            text: secondary,
                                        }
                                    });
                                }).reduce((a, b) => a.concat(b));
                            }).reduce((a, b) => a.concat(b)));
                        } else {
                            resolve([]);
                        }
                    }).catch((e) => { });
                }).catch((e) => { });
            }, config.modules.dictionary.debounce_time)
        });
    },
    execute: async (option) => {
        clipboard.writeText(option.text);
    },
}

export default DictionaryModule;
