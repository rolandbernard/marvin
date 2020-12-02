
import puppeteer from 'puppeteer-core';
import pie from 'puppeteer-in-electron';
import { app } from 'electron';

const isDevelopment = process.env.NODE_ENV !== 'production';

export let browser = null;

(async () => {
    await pie.initialize(app, isDevelopment ? 33551 : undefined);
    browser = await pie.connect(app, puppeteer);
})();
