
import { app, BrowserWindow, Event, Tray, Menu, globalShortcut } from 'electron';
import { join } from 'path';

import { getAllTranslations, getTranslation } from 'common/local/locale';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { Query } from 'common/query';
import { isDevelopment } from 'common/platform';
import { copyCase } from 'common/util';

import { config } from 'main/config';
import { module, moduleForId } from 'main/modules';
import { SettingsModule } from 'main/modules/settings';

import Logo from 'logo.png';

const MODULE_ID = 'main';

// Transparency will not work without this
app.commandLine.appendSwitch("disable-gpu");

@module(MODULE_ID as any) // This module has no config => needs no translation
export class MainModule implements Module<SimpleResult> {
    tray?: Tray;
    window?: BrowserWindow;
    shortcut?: string;

    createTrayIcon() {
        this.tray = new Tray(join(__dirname, Logo));
        this.tray.setToolTip('Marvin');
        const context_menu = Menu.buildFromTemplate([
            {
                label: getTranslation('open', config),
                type: 'normal',
                click: this.showWindow.bind(this),
                accelerator: config.general.global_shortcut
            },
            { label: getTranslation('settings', config), type: 'normal', click: this.openSettings.bind(this) },
            { label: getTranslation('quit', config), type: 'normal', click: app.quit.bind(app) },
        ]);
        this.tray.setContextMenu(context_menu);
    }

    openSettings() {
        moduleForId<SettingsModule>('settings')?.showWindow();
    }

    createWindow() {
        const inDevelopment = isDevelopment();

        this.window = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                experimentalFeatures: true,
                plugins: true,
            },
            resizable: false,
            maximizable: false,
            minimizable: false,
            movable: false,
            skipTaskbar: true,
            center: true,
            frame: inDevelopment,
            show: false,
            transparent: true,
            alwaysOnTop: true,
            width: config.general.width + 20,
            height: config.general.max_height + 20,
            icon: join(__dirname, Logo),
        });

        const hideWindow = (e: Event) => {
            e.preventDefault();
            this.hideWindow();
        };
        this.window.on('close', hideWindow);
        if (!inDevelopment) {
            this.window.on('blur', hideWindow);
        }

        this.window.webContents.on('will-navigate', (e) => {
            e.preventDefault();
        });

        this.window.loadURL(`file://${join(__dirname, 'app.html')}`);
    }

    hideWindow() {
        this.window?.webContents.send('hide');
        // Give the renderer time to hide the results. Otherwise the old results will be visible
        // for the first frame when showing the window for the next query.
        setTimeout(() => {
            this.window?.hide();
        }, 50);
    }

    showWindow() {
        this.window?.webContents.send('show', config, config.getDescription());
        this.window?.show();
        if (config.general.recenter_on_show) {
            this.window?.center();
        }
        this.window?.focus();
    }

    toggleWindow() {
        if (this.window?.isVisible()) {
            this.hideWindow();
        } else {
            this.showWindow();
        }
    }

    registerShortcut() {
        if (this.shortcut !== config.general.global_shortcut) {
            const ret = globalShortcut.register(config.general.global_shortcut, this.toggleWindow.bind(this));
            if (!ret) {
                console.error('Failed to register a global shortcut.');
            } else if (this.shortcut) {
                globalShortcut.unregister(this.shortcut);
            }
            this.shortcut = config.general.global_shortcut;
        }
    }

    async init() {
        this.createTrayIcon();
        this.registerShortcut();
        setTimeout(() => {
            // This has to be delayed, because otherwise transparency will not work on linux
            this.createWindow();
        }, 500)
    }

    async update() {
        this.registerShortcut();
        this.window?.webContents.send('show', config, config.getDescription());
    }

    async deinit() {
        if (this.shortcut) {
            globalShortcut.unregister(this.shortcut);
        }
        this.window?.destroy();
        this.tray?.destroy();
    }

    async search(query: Query): Promise<SimpleResult[]> {
        if (query.text.length > 0) {
            const name = getTranslation('quit', config);
            return [{
                module: MODULE_ID,
                kind: 'simple-result',
                query: query.text,
                quality: query.matchAny(getAllTranslations('quit'), name),
                icon: { material: 'exit_to_app' },
                primary: name,
                autocomplete: copyCase(name, query.raw),
            }];
        } else {
            return [];
        }
    }

    async execute() {
        // There is only one action: quit.
        app.quit();
    }
}

