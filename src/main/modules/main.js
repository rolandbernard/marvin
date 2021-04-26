
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

const MAX_TRANSFER_LEN = 200; // Text in the results sent to the renderer will be croped to this length.

// This stores the original_options because we only send croped text fields.
// (Fixes a performance issue when the clipboard contains a very long text)
const original_option = new Map();

// This variable is used to ensure that if a earlier query finishes after a later query, it will not
// actualty sen the results to the renderer.
let execution_count = 0;

function sendUpdatedOptions(id, sender, results) {
    if (id === execution_count) {
        original_option.clear();
        sender.send('update-options', results.map((opt, id) => {
            const new_opt = { ...opt, id: id };
            if (new_opt.text?.length > MAX_TRANSFER_LEN) {
                new_opt.text = new_opt.text.substr(0, MAX_TRANSFER_LEN) + '...';
            }
            if (new_opt.primary?.length > MAX_TRANSFER_LEN) {
                new_opt.primary = new_opt.primary.substr(0, MAX_TRANSFER_LEN) + '...';
            }
            if (new_opt.secondary?.length > MAX_TRANSFER_LEN) {
                new_opt.secondary = new_opt.secondary.substr(0, MAX_TRANSFER_LEN) + '...';
            }
            original_option.set(id, opt);
            return new_opt;
        }));
    }
}

async function handleQuery(query, sender) {
    execution_count++;
    const begin_count = execution_count;
    const results = await searchQuery(query,
        config.general.incremental_results
            ? (results) => sendUpdatedOptions(begin_count, sender, results)
            : null
    );
    sendUpdatedOptions(begin_count, sender, results);
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
            const key = option.id;
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
    ipcMain.on('drag-start', async (event, option) => {
        event.sender.startDrag({
            file: option.file,
            icon: (await app.getFileIcon(option.file)),
        })
    })
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
        if ((op === undefined || !op) && main_window.isVisible()) {
            // Give the renderer time to hide the results. Otherwise the old results will be visible
            // for the first frame when showing the window for the next query.
            await new Promise(res => setTimeout(() => res(), 50));
            main_window.hide();
        } else if ((op === undefined || op) && !main_window.isVisible()) {
            handleQuery('', main_window); // Initially fill with an empty query result
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

