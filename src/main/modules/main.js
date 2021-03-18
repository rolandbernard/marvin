
import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { config } from '../config';
import { executeOption, searchQuery } from '../executor';
import { getTranslation, getAllTranslation } from '../../common/local/locale';
import { stringMatchQuality } from '../search';
import { openSettingsWindow } from './settings';

const isDevelopment = process.env.NODE_ENV !== 'production';

let tray;

let main_window;

let last_loading = null;
let last_query = null;

const MAX_TRANSFER_LEN = 1000;

const original_option = new Map();

function handleQuery(query, sender) {
    if (query !== last_query) {
        clearTimeout(last_loading);
        last_loading = setTimeout(() => msg.sender.send('update-options', null), config.general.debounce_time + 100);
        searchQuery(query, (results) => {
            clearTimeout(last_loading);
            original_option.clear();
            sender.send('update-options', results.map((opt) => {
                const new_opt = { ...opt };
                if (new_opt.text?.length > MAX_TRANSFER_LEN) {
                    new_opt.text = new_opt.text.substr(0, MAX_TRANSFER_LEN) + '...';
                }
                if (new_opt.primary?.length > MAX_TRANSFER_LEN) {
                    new_opt.primary = new_opt.primary.substr(0, MAX_TRANSFER_LEN) + '...';
                }
                if (new_opt.secondary?.length > MAX_TRANSFER_LEN) {
                    new_opt.secondary = new_opt.secondary.substr(0, MAX_TRANSFER_LEN) + '...';
                }
                original_option.set(JSON.stringify(new_opt), opt);
                return new_opt;
            }));
        });
    }
}

export function createMainWindow() {
    main_window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            plugins: true,
            contextIsolation: false,
            webSecurity: !isDevelopment,
            experimentalFeatures: true,
        },
        resizable: false,
        maximizable: false,
        minimizable: false,
        movable: false,
        skipTaskbar: true,
        center: true,
        frame: false,
        show: false,
        transparent: true,
        width: config.general.width + 20,
        height: config.general.max_height + 20,
        alwaysOnTop: true,
        icon: path.join(__static, 'logo.png'),
    });

    if (isDevelopment) {
        main_window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/index.html`);
    } else {
        main_window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file',
            slashes: true
        }));
    }

    const hideWindow = (e) => {
        e.preventDefault();
        toggleMain(false);
    };

    main_window.webContents.on('will-navigate', (e) => {
        e.preventDefault();
    });
    main_window.webContents.on('new-window', (e) => {
        e.preventDefault();
    });
    main_window.on('close', hideWindow);
    if (!isDevelopment) {
        main_window.on('blur', hideWindow);
    }

    ipcMain.on('search-options', (msg, query) => {
        handleQuery(query, msg.sender);
    });
    ipcMain.on('execute-option', (_, option) => {
        if (option && option.executable) {
            const key = JSON.stringify(option);
            if (original_option.has(key)) {
                executeOption(original_option.get(key));
            } else {
                executeOption(option);
            }
            if (!option.stay_open) {
                toggleMain(false);
            }
        }
    });
}

export function destroyMainWindow() {
    if (main_window && !main_window.isDestroyed()) {
        main_window.destroy();
    }
}

export async function toggleMain(op) {
    if (main_window && !main_window.isDestroyed()) {
        main_window.webContents.send('update-config', config);
        main_window.webContents.send('reset');
        handleQuery('', main_window);
        if ((op === undefined || !op) && main_window.isVisible()) {
            main_window.hide();
        } else if ((op === undefined || op) && !main_window.isVisible()) {
            main_window.show();
            if (config.general.recenter_on_show) {
                main_window.center();
            }
            main_window.focus();
        }
    }
}

const MainModule = {
    init: async () => {
        createMainWindow();
        tray = new Tray(path.join(__static, 'logo.png'));
        tray.setToolTip('Marvin');
        const context_menu = Menu.buildFromTemplate([
            {
                label: getTranslation(config, 'open'),
                type: 'normal',
                click: () => toggleMain(true),
                accelerator: config.general.global_shortcut
            },
            { label: getTranslation(config, 'settings'), type: 'normal', click: openSettingsWindow },
            { label: getTranslation(config, 'quit'), type: 'normal', click: app.quit.bind(app) },
        ]);
        tray.setContextMenu(context_menu);
        const ret = globalShortcut.register(config.general.global_shortcut, toggleMain);
        if (!ret) {
            console.error('Failed to register a global shortcut');
        }
    },
    update: async () => {
        const context_menu = Menu.buildFromTemplate([
            {
                label: getTranslation(config, 'open'),
                type: 'normal',
                click: () => toggleMain(true),
                accelerator: config.general.global_shortcut
            },
            { label: getTranslation(config, 'settings'), type: 'normal', click: openSettingsWindow },
            { label: getTranslation(config, 'quit'), type: 'normal', click: app.quit.bind(app) },
        ]);
        tray.setContextMenu(context_menu);
    },
    deinit: async () => {
        globalShortcut.unregisterAll();
        destroyMainWindow();
    },
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query, regex) => {
        const language = config.general.language;
        const quit_match = Math.max(...(
            getAllTranslation('quit').map(([trans, lang]) => (lang === language ? 1 : 0.5) * stringMatchQuality(query, trans, regex))
        ));
        return [{
            type: 'icon_list_item',
            material_icon: 'exit_to_app',
            primary: getTranslation(config, 'quit'),
            secondary: null,
            executable: true,
            quality: quit_match,
        }];
    },
    execute: async (_) => {
        app.quit();
    },
}

export default MainModule;

