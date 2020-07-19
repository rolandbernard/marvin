
import puppeteer from 'puppeteer-core';
import pie from 'puppeteer-in-electron';
import { app } from 'electron';

export let browser = null;

(async () => {
    await pie.initialize(app);
    browser = await pie.connect(app, puppeteer);
})();
