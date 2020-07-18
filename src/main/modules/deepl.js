
import puppeteer from 'puppeteer-core';
import pie from 'puppeteer-in-electron';
import { config } from '../config';
import { clipboard, app, BrowserWindow } from 'electron';

let browser = null;
let page = null;
let window = null;

let cancel_last = null;
let last_lang = null;

let languages = {
    'en-EN': [ 'English', 'Inglese', 'Englisch' ],
    'de-DE': [ 'German', 'Tedesco', 'Deutsch' ],
    'fr-FR': [ 'French', 'Francese', 'Französisch' ],
    'es-ES': [ 'Spanish', 'Spagnolo', 'Spanisch' ],
    'it-IT': [ 'Italian', 'Italiano', 'Italienisch' ],
    'nl-NL': [ 'Dutch', 'Olandese', 'Niederländisch' ],
    'pl-PL': [ 'Polish', 'Polacco', 'Polnisch' ],
};

(async () => {
    await pie.initialize(app);
    browser = await pie.connect(app, puppeteer);
})();

const DeeplModule = {
    init: async () => {
        if(config.modules.deepl.active) {
            window = new BrowserWindow({
                show: false,
                width: 1000,
                height: 1000,
                resizable: false,
            });
            const url = 'https://www.deepl.com/translator';
            await window.loadURL(url);;
            while(!browser) {
                await new Promise((res) => setTimeout(() => res(), 100));
            }
            page = await pie.getPage(browser, window);
            try {
                await page.click('.dl_cookieBanner--buttonSelected');
            } catch (e) { }
        }
    },
    update: async (old_config) => {
        if(old_config.modules.deepl.active && !config.modules.deepl.active) {
            await DeeplModule.deinit();
        }
        if(!old_config.modules.deepl.active && config.modules.deepl.active) {
            await DeeplModule.init();
        }
    },
    deinit: async () => {
        if(window) {
            window.destroy();
        }
    },
    valid: (query) => {
        if (config.modules.deepl.active) {
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
            await page.goto('https://www.deepl.com/translator')
            await page.waitFor(100);
            if (stop) {
                resolve();
                return;
            }
            await page.click('button[dl-test=translator-target-lang-btn]');
            if (stop) {
                resolve();
                return;
            }
            await page.waitFor(100);
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
            await page.waitFor(20);
            if (stop) {
                resolve();
                return;
            }
            await page.focus('textarea[dl-test=translator-source-input]');
            if (stop) {
                resolve();
                return;
            }
            await page.waitFor(20);
            if (stop) {
                resolve();
                return;
            }
            await page.keyboard.type(text);
            if (stop) {
                resolve();
                return;
            }
            await page.waitFor(500);
            if (stop) {
                resolve();
                return;
            }
            await page.waitForNavigation({ waitUntil: 'networkidle0' })
            if (stop) {
                resolve();
                return;
            }
            await page.waitFor(500);
            if (stop) {
                resolve();
                return;
            }
            return (await Promise.all((await page.$$('p[dl-test=translator-target-result-as-text-entry]')).map(async (elem) => ({
                type: 'icon_text',
                material_icon: 'translate',
                text: (await (await elem.getProperty('innerText')).jsonValue()).trim(),
                executable: true,
                quality: 1.0,
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