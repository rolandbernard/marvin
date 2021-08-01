
import { BrowserWindow } from 'electron';
import { join } from 'path';

import { getAllTranslations, getTranslation } from 'common/local/locale';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { Query } from 'common/query';
import { isDevelopment } from 'common/platform';
import { IpcChannels } from 'common/ipc';

import { config } from 'main/config';
import { module } from 'main/modules';

import Logo from 'logo.png';

const MODULE_ID = 'settings';

@module(MODULE_ID)
export class SettingsModule implements Module<SimpleResult> {
    window?: BrowserWindow;

    createWindow() {
        const inDevelopment = isDevelopment();

        this.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            center: true,
            show: false,
            width: config.general.width * 2,
            icon: join(__dirname, Logo),
            title: 'Marvin ' + getTranslation('settings', config),
        });

        if (!inDevelopment) {
            this.window.removeMenu();
        }

        this.window.on('close', e => {
            e.preventDefault();
            this.hideWindow();
        });

        this.window.loadURL(`file://${join(__dirname, 'settings.html')}`);
    }

    hideWindow() {
        this.window?.webContents.send(IpcChannels.HIDE_WINDOW);
        this.window?.hide();
    }

    showWindow() {
        this.window?.webContents.send(IpcChannels.SHOW_WINDOW, config, config.getDescription());
        this.window?.show();
        this.window?.focus();
    }

    async init() {
        this.createWindow();
    }

    async update() {
        this.window?.webContents.send(IpcChannels.SHOW_WINDOW, config, config.getDescription());
    }

    async deinit() {
        this.window?.destroy();
    }

    settingsItem(query: Query): SimpleResult {
        const name = getTranslation('settings', config);
        return {
            module: MODULE_ID,
            kind: 'simple-result',
            query: query.text,
            quality: query.matchAny(getAllTranslations('settings'), name),
            icon: { material: 'settings' },
            primary: name,
            autocomplete: name,
        };
    }

    async search(query: Query): Promise<SimpleResult[]> {
        if (query.text.length > 0) {
            return [this.settingsItem(query)];
        } else {
            return [];
        }
    }

    async rebuild(query: Query, _result: SimpleResult): Promise<SimpleResult | undefined> {
        return this.settingsItem(query);
    }

    async execute() {
        this.showWindow();
    }
}

