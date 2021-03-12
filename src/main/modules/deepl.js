
import pie from 'puppeteer-in-electron';
import { config } from '../config';
import { clipboard, BrowserWindow } from 'electron';
import { browser } from '../puppeteer';

let page = null;
let window = null;

let cancel_last = null;
let last_lang = null;

const LANGUAGES = {
    'en-US': ['English', 'Inglese', 'Englisch'],
    'fr-FR': ['French', 'Francese', 'Französisch'],
    'es-ES': ['Spanish', 'Spagnolo', 'Spanisch'],
    'pt-PT': ['Portuguese', 'Portugiesisch', 'Portoghese'],
    'it-IT': ['Italian', 'Italiano', 'Italienisch'],
    'nl-NL': ['Dutch', 'Olandese', 'Niederländisch'],
    'pl-PL': ['Polish', 'Polacco', 'Polnisch'],
    'de-DE': ['German', 'Tedesco', 'Deutsch'],
    'ru-RU': ['Russian', 'Russo', 'Russisch'],
    'ja-JA': ['Japanese', 'Giapponese', 'Japanisch'],
    'zh-ZH': ['Chinese', 'Cinese', 'Chinesisch'],
};

const DeeplModule = {
    init: async () => {
        if (config.modules.deepl.active) {
            window = new BrowserWindow({
                webPreferences: {
                    contextIsolation: false,
                },
                show: false,
                width: 1000,
                height: 1000,
                resizable: false,
            });
            (async () => {
                const url = 'https://www.deepl.com/translator';
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
                    await page.click('.dl_cookieBanner--buttonSelected');
                } catch (e) { }
            })()
        }
    },
    update: async (old_config) => {
        if (old_config.modules.deepl.active && !config.modules.deepl.active) {
            await DeeplModule.deinit();
        }
        if (!old_config.modules.deepl.active && config.modules.deepl.active) {
            await DeeplModule.init();
        }
    },
    deinit: async () => {
        if (window) {
            window.destroy();
        }
    },
    valid: (query) => {
        if (page) {
            if (cancel_last) {
                cancel_last();
                cancel_last = null;
            }
            const to = query.toLowerCase().lastIndexOf(' to ');
            if (to === -1) {
                return false;
            } else {
                const lang = query.substr(to + 4).toLowerCase().trim();
                return query.substr(0, to).trim().length >= 1 && Object.values(LANGUAGES).find((l) => l.find((n) => n.toLowerCase() === lang));
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
            const lang = Object.keys(LANGUAGES).find((l) => LANGUAGES[l].find((n) => n.toLowerCase() === lang_name));
            const text = query.substr(0, to).trim();
            await page.click('textarea[dl-test=translator-source-input]');
            if (stop) {
                resolve();
                return;
            }
            await page.waitForTimeout(100);
            if (stop) {
                resolve();
                return;
            }
            await page.keyboard.down('Control');
            await page.keyboard.press('a');
            await page.keyboard.up('Control');
            await page.keyboard.press('Backspace');
            if (stop) {
                resolve();
                return;
            }
            if (last_lang != lang) {
                await page.waitForTimeout(100);
                if (stop) {
                    resolve();
                    return;
                }
                await page.click('button[dl-test=translator-target-lang-btn]');
                if (stop) {
                    resolve();
                    return;
                }
                await page.waitForTimeout(100);
                if (stop) {
                    resolve();
                    return;
                }
                await page.click(`div[dl-test=translator-target-lang-list] button[dl-test=translator-lang-option-${lang}]`);
                if (stop) {
                    resolve();
                    return;
                }
                last_lang = lang;
            }
            await page.waitForTimeout(20);
            if (stop) {
                resolve();
                return;
            }
            await page.click('textarea[dl-test=translator-source-input]');
            if (stop) {
                resolve();
                return;
            }
            await page.waitForTimeout(100);
            if (stop) {
                resolve();
                return;
            }
            await page.keyboard.type(text);
            if (stop) {
                resolve();
                return;
            }
            await page.waitForSelector('.lmt--active_translation_request');
            if (stop) {
                resolve();
                return;
            }
            await page.waitForSelector('.lmt--active_translation_request', { hidden: true });
            if (stop) {
                resolve();
                return;
            }
            await page.waitForTimeout(100);
            if (stop) {
                resolve();
                return;
            }
            return (await Promise.all((await page.$$('p[dl-test=translator-target-result-as-text-entry]')).map(async (elem) => ({
                type: 'icon_text',
                material_icon: 'translate',
                text: (await (await elem.getProperty('innerText')).jsonValue()).trim(),
                executable: true,
                quality: config.modules.deepl.quality,
            })))).filter((option) => option.text.length >= 1);
        } catch (e) {
            return [];
        }
    },
    execute: async (option) => {
        clipboard.writeText(option.text);
    },
};

export default DeeplModule;
