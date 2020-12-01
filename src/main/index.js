
import { TurnedInRounded } from '@material-ui/icons';
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { loadConfig, config, updateConfig } from './config';
import { executeOption, searchQuery, initModules, deinitModules, updateModules } from './executor';
import { createSettingsWindow } from './modules/settings';

const isDevelopment = process.env.NODE_ENV !== 'production';

let main_window;

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
        width: config.general.width,
        height: config.general.max_height,
        alwaysOnTop: true,
        icon: path.join(__static, 'logo.png'),
        paintWhenInitiallyHidden: true,
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
    main_window.on('blur', hideWindow);
}

async function toggleMain(op) {
    if (main_window && !main_window.isDestroyed()) {
        main_window.webContents.send('reset', config);
        if ((op === undefined || !op ) && main_window.isVisible()) {
            await new Promise(res => setTimeout(() => res(), 50));
            main_window.hide();
        } else if ((op === undefined || op ) && !main_window.isVisible()) {
            main_window.show();
            if(config.general.recenter_on_show) {
                main_window.center();
            }
            main_window.focus();
        }
    }
}

let last_loading = null;

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

        ipcMain.on('input-change', (_, query) => {
            clearTimeout(last_loading);
            last_loading = setTimeout(() => main_window.webContents.send('update-options', null), config.general.debounce_time + 100);            
            searchQuery(query, (results) => {
                clearTimeout(last_loading);
                main_window.webContents.send('update-options', results);
            });
        });
        ipcMain.on('execute-option', (_, option) => {
            if (option && option.executable) {
                executeOption(option);
                if(!option.stay_open) {
                    toggleMain(false);
                }
            }
        });
        ipcMain.on('config-update', async (_, new_config) => {
            if (config.general.global_shortcut !== new_config.general.global_shortcut) {
                try {
                    const ret = globalShortcut.register(new_config.general.global_shortcut, toggleMain);
                    if (ret) {
                        globalShortcut.unregister(config.general.global_shortcut);
                    } else {
                        new_config.general.global_shortcut = config.general.global_shortcut;
                    }
                } catch(e) {
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
