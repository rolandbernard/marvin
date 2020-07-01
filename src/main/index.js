
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import { loadConfig, config } from './config';
import { executeOption, searchQuery } from './executor';

const isDevelopment = process.env.NODE_ENV !== 'production';

let main_window;
let settings_window;
let tray_icon;

function createMainWindow() {
    main_window = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
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
        icon: path.join(__static, 'logo.ico'),
    });

    // if (isDevelopment) {
    //     main_window.webContents.openDevTools();
    // }

    if (isDevelopment) {
        main_window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/main.html`);
    } else {
        main_window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'main.html'),
            protocol: 'file',
            slashes: true
        }));
    }

    const hideWindow = (e) => {
        e.preventDefault();
        main_window.hide();
    };

    main_window.on('close', hideWindow);
    main_window.on('blur', hideWindow);
}

function startApp() {
    const gotSingleInstanceLock = app.requestSingleInstanceLock();
    if (gotSingleInstanceLock) {
        loadConfig();
        createMainWindow();

        const ret = globalShortcut.register(config.general.global_shortcut, () => {
            if (main_window && !main_window.isDestroyed()) {
                main_window.webContents.send('reset', config);
                if (main_window.isVisible()) {
                    main_window.hide();
                } else {
                    main_window.show();
                    main_window.focus();
                }
            }
        });
        if (!ret) {
            console.error('Failed to register a global shortcut');
            app.quit();
        }

        ipcMain.on('input-change', async (_, query) => {
            const loading = setTimeout(() => main_window.webContents.send('update-options', null), 100);
            await searchQuery(query, (results) => {
                main_window.webContents.send('update-options', results);
            });
            clearTimeout(loading);
        });
        ipcMain.on('execute-option', (_, option) => {
            if (option && option.executable) {
                executeOption(option);
                main_window.hide();
            }
        });
    } else {
        console.error("Other instance is already running: quitting app.");
        app.quit();
    }
}

function closeApp() {
    globalShortcut.unregisterAll();
    if (tray_icon && !tray_icon.isDestroyed()) {
        tray_icon.destroy();
    }
    if (main_window && !main_window.isDestroyed()) {
        main_window.destroy();
    }
}

app.on('ready', () => setTimeout(startApp, 500));

app.on("window-all-closed", () => {
    app.quit();
});

app.on('will-quit', () => closeApp())

