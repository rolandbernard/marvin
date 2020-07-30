
import pie from 'puppeteer-in-electron';
import { config } from '../config';
import { clipboard, BrowserWindow } from 'electron';
import { browser } from '../puppeteer';

let page = null;
let window = null;

let cancel_last = null;
let last_lang = null;

let languages = {
    'it': [ 'Italian' ],
    'de': [ 'German' ],
    'en': [ 'English' ],
    'af': [ 'Afrikaans' ],
    'sq': [ 'Albanian' ],
    'am': [ 'Amharic' ],
    'ar': [ 'Arabic' ],
    'hy': [ 'Armenian' ],
    'az': [ 'Azerbaijani' ],
    'eu': [ 'Basque' ],
    'be': [ 'Belarusian' ],
    'bn': [ 'Bengali' ],
    'bs': [ 'Bosnian' ],
    'bg': [ 'Bulgarian' ],
    'ca': [ 'Catalan' ],
    'ceb': [ 'Cebuano' ],
    'ny': [ 'Chichewa' ],
    'zh-CN': [ 'Chinese' ],
    'co': [ 'Corsican' ],
    'hr': [ 'Croatian' ],
    'cs': [ 'Czech' ],
    'da': [ 'Danish' ],
    'nl': [ 'Dutch' ],
    'en': [ 'English' ],
    'eo': [ 'Esperanto' ],
    'et': [ 'Estonian' ],
    'tl': [ 'Filipino' ],
    'fi': [ 'Finnish' ],
    'fr': [ 'French' ],
    'fy': [ 'Frisian' ],
    'gl': [ 'Galician' ],
    'ka': [ 'Georgian' ],
    'el': [ 'Greek' ],
    'gu': [ 'Gujarati' ],
    'ht': [ 'Haitian Creole' ],
    'ha': [ 'Hausa' ],
    'haw': [ 'Hawaiian' ],
    'iw': [ 'Hebrew' ],
    'hi': [ 'Hindi' ],
    'hmn': [ 'Hmong' ],
    'hu': [ 'Hungarian' ],
    'is': [ 'Icelandic' ],
    'ig': [ 'Igbo' ],
    'id': [ 'Indonesian' ],
    'ga': [ 'Irish' ],
    'ja': [ 'Japanese' ],
    'jw': [ 'Javanese' ],
    'kn': [ 'Kannada' ],
    'kk': [ 'Kazakh' ],
    'km': [ 'Khmer' ],
    'rw': [ 'Kinyarwanda' ],
    'ko': [ 'Korean' ],
    'ku': [ 'Kurdish' ],
    'ky': [ 'Kyrgyz' ],
    'lo': [ 'Lao' ],
    'la': [ 'Latin' ],
    'lv': [ 'Latvian' ],
    'lt': [ 'Lithuanian' ],
    'lb': [ 'Luxembourgish' ],
    'mk': [ 'Macedonian' ],
    'mg': [ 'Malagasy' ],
    'ms': [ 'Malay' ],
    'ml': [ 'Malayalam' ],
    'mt': [ 'Maltese' ],
    'mi': [ 'Maori' ],
    'mr': [ 'Marathi' ],
    'mn': [ 'Mongolian' ],
    'my': [ 'Myanmar' ],
    'ne': [ 'Nepali' ],
    'no': [ 'Norwegian' ],
    'or': [ 'Odia' ],
    'ps': [ 'Pashto' ],
    'fa': [ 'Persian' ],
    'pl': [ 'Polish' ],
    'pt': [ 'Portuguese' ],
    'pa': [ 'Punjabi' ],
    'ro': [ 'Romanian' ],
    'ru': [ 'Russian' ],
    'sm': [ 'Samoan' ],
    'gd': [ 'Scots Gaelic' ],
    'sr': [ 'Serbian' ],
    'st': [ 'Sesotho' ],
    'sn': [ 'Shona' ],
    'sd': [ 'Sindhi' ],
    'si': [ 'Sinhala' ],
    'sk': [ 'Slovak' ],
    'sl': [ 'Slovenian' ],
    'so': [ 'Somali' ],
    'es': [ 'Spanish' ],
    'su': [ 'Sundanese' ],
    'sw': [ 'Swahili' ],
    'sv': [ 'Swedish' ],
    'tg': [ 'Tajik' ],
    'ta': [ 'Tamil' ],
    'tt': [ 'Tatar' ],
    'te': [ 'Telugu' ],
    'th': [ 'Thai' ],
    'tr': [ 'Turkish' ],
    'tk': [ 'Turkmen' ],
    'uk': [ 'Ukrainian' ],
    'ur': [ 'Urdu' ],
    'ug': [ 'Uyghur' ],
    'uz': [ 'Uzbek' ],
    'vi': [ 'Vietnamese' ],
    'cy': [ 'Welsh' ],
    'xh': [ 'Xhosa' ],
    'yi': [ 'Yiddish' ],
    'yo': [ 'Yoruba' ],
    'zu': [ 'Zulu' ],
};

const GoogleTranslateModule = {
    init: async () => {
        if(config.modules.google_translate.active) {
            window = new BrowserWindow({
                show: false,
                width: 1000,
                height: 1000,
                resizable: false,
            });
            (async () => {
                const url = 'https://translate.google.com/';
                let success = false;
                while (!success) {
                    try {
                        await window.loadURL(url);;
                        success = true;
                    } catch (e) {
                        await new Promise(res => setTimeout(() => res(), 500));
                    }
                }
                while (!browser) {
                    await new Promise((res) => setTimeout(() => res(), 100));
                }
                page = await pie.getPage(browser, window);
                try {
                    await page.click('.tlid-open-source-language-list');
                    await page.waitFor(100);
                    await page.click('.language-list-unfiltered-langs-sl_list .language_list_item_wrapper-auto');
                } catch (e) { }
            })();
        }
    },
    update: async (old_config) => {
        if(old_config.modules.google_translate.active && !config.modules.google_translate.active) {
            await GoogleTranslateModule.deinit();
        }
        if(!old_config.modules.google_translate.active && config.modules.google_translate.active) {
            await GoogleTranslateModule.init();
        }
    },
    deinit: async () => {
        if(window) {
            window.destroy();
        }
    },
    valid: (query) => {
        if (config.modules.google_translate.active && page) {
            if (cancel_last) {
                cancel_last();
                cancel_last = null;
            }
            const to = query.toLowerCase().lastIndexOf(' to ');
            if (to === -1) {
                return false;
            } else {
                const lang = query.substr(to + 4).toLowerCase().trim();
                return query.substr(0, to).trim().length >= 1 && Object.values(languages).find((l) => l.find((n) => n.toLowerCase() === lang));
            }
        } else {
            return false;
        }
    },
    search: async (query) => {
        let stop = false;
        cancel_last = () => {
            stop = true;
        };
        try {
            const to = query.toLowerCase().lastIndexOf(' to ');
            const lang_name = query.substr(to + 4).toLowerCase().trim();
            const lang = Object.keys(languages).find((l) => languages[l].find((n) => n.toLowerCase() === lang_name));
            const text = query.substr(0, to).trim();
            await page.click('#source');
            if (stop) {
                resolve();
                return;
            }
            await page.waitFor(100);
            if (stop) {
                resolve();
                return;
            }
            await page.evaluate(() => {
                document.querySelector('#source').value = '';
            });
            if (stop) {
                resolve();
                return;
            }
            if (last_lang != lang) {
                await page.waitFor(100);
                if (stop) {
                    resolve();
                    return;
                }
                await page.click('.tlid-open-target-language-list');
                if (stop) {
                    resolve();
                    return;
                }
                await page.waitFor(100);
                if (stop) {
                    resolve();
                    return;
                }
                await page.click(`.language-list-unfiltered-langs-tl_list .language_list_section:last-child .language_list_item_wrapper-${lang}`);
                if (stop) {
                    resolve();
                    return;
                }
                last_lang = lang;
            }
            await page.waitFor(20);
            if (stop) {
                resolve();
                return;
            }
            await page.evaluate((t) => {
                document.querySelector('#source').value = t;
            }, text);
            if (stop) {
                resolve();
                return;
            }
            await page.waitForSelector('.translating');
            if (stop) {
                resolve();
                return;
            }
            await page.waitForSelector('.translating', { hidden: true });
            if (stop) {
                resolve();
                return;
            }
            await page.waitFor(100);
            if (stop) {
                resolve();
                return;
            }
            let first_text = ''
            try {
                first_text = (await (await (await page.$('.result')).getProperty('innerText')).jsonValue()).trim();
            } catch (e) { }
            return [{
                type: 'icon_text',
                material_icon: 'g_translate',
                text: first_text,
                executable: true,
                quality: 1.0,
            }].concat((await Promise.all((await page.$$('.gt-baf-term-text')).map(async (elem, index) => {
                let text = ''
                let translation = '';
                try {
                    text = (await (await elem.getProperty('innerHTML')).jsonValue()).replace(/<[^/]*>/g, '').replace(/<\/[^/]*>/g, ' ').trim();
                    translation = (await (await (await page.$$('.gt-baf-translations'))[index].getProperty('innerText')).jsonValue()).trim();
                } catch (e) { }
                return {
                    type: 'icon_list_item',
                    material_icon: 'g_translate',
                    primary: text,
                    secondary: translation,
                    executable: true,
                    quality: 1.0,
                    text: text,
                };
            }))).filter((option) => option.text.length >= 1));
        } catch (e) {
            console.error(e);
            return [];
        }
    },
    execute: async (option) => {
        clipboard.writeText(option.text);
    },
};

export default GoogleTranslateModule;
