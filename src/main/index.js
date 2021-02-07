
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { loadConfig, config, updateConfig } from './config';
import { executeOption, searchQuery, initModules, deinitModules, updateModules } from './executor';
import { createSettingsWindow } from './modules/settings';

const isDevelopment = process.env.NODE_ENV !== 'production';

let main_window;

app.commandLine.appendSwitch("disable-gpu"); // Transparancy will not work without this

function createMainWindow() {
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
}

async function toggleMain(op) {
    if (main_window && !main_window.isDestroyed()) {
        main_window.webContents.send('update-config', config);
        main_window.webContents.send('reset');
        if ((op === undefined || !op) && main_window.isVisible()) {
            await new Promise(res => setTimeout(() => res(), 50));
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

let last_loading = null;

const MAX_TRANSFER_LEN = 1000;

async function startApp() {
    const gotSingleInstanceLock = app.requestSingleInstanceLock();
    if (gotSingleInstanceLock) {
        loadConfig();
        const ret = globalShortcut.register(config.general.global_shortcut, toggleMain);
        if (!ret) {
            console.error('Failed to register a global shortcut');
            app.quit();
        }
        await initModules();
        createMainWindow();
        createSettingsWindow();

        const original_option = new Map();
        ipcMain.on('search-options', (msg, query) => {
            clearTimeout(last_loading);
            last_loading = setTimeout(() => msg.sender.send('update-options', null), config.general.debounce_time + 100);
            searchQuery(query, (results) => {
                clearTimeout(last_loading);
                original_option.clear();
                msg.sender.send('update-options', results.map((opt) => {
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
        ipcMain.on('update-config', async (_, new_config) => {
            if (config.general.global_shortcut !== new_config.general.global_shortcut) {
                try {
                    const ret = globalShortcut.register(new_config.general.global_shortcut, toggleMain);
                    if (ret) {
                        globalShortcut.unregister(config.general.global_shortcut);
                    } else {
                        new_config.general.global_shortcut = config.general.global_shortcut;
                    }
                } catch (e) {
                    new_config.general.global_shortcut = config.general.global_shortcut;
                }
            }
            const old_config = JSON.parse(JSON.stringify(config));
            updateConfig(new_config);
            await updateModules(old_config);
        });
    } else {
        console.error("Other instance is already running: quitting app.");
        closeApp();
    }
}

async function closeApp() {
    await deinitModules();
    globalShortcut.unregisterAll();
    if (main_window && !main_window.isDestroyed()) {
        main_window.destroy();
    }
}

app.on('ready', () => setTimeout(startApp, 500));
app.on('before-exit', closeApp);
