
import { app, globalShortcut, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

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
        width: 1600,
        height: 500,
        alwaysOnTop: true,
        icon: path.join(__static, 'logo.ico'),
    });

    if (isDevelopment) {
        main_window.webContents.openDevTools();
    }

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

app.on('ready', () => {
    const gotSingleInstanceLock = app.requestSingleInstanceLock();
    if (gotSingleInstanceLock) {
        createMainWindow();

        const ret = globalShortcut.register('Super+D', () => {
            if (main_window && !main_window.isDestroyed()) {
                if (main_window.isVisible()) {
                    main_window.hide();
                } else {
                    main_window.webContents.send('reset');
                    main_window.show();
                    main_window.focus();
                }
            }
        });
        if (!ret) {
            console.error('Failed to register a global shortcut');
            app.quit();
        }

        ipcMain.on('input-change', (_, query) => {
            // ipcRenderer.send('update-options', null);
            console.log(query);
        });
        ipcMain.on('execute-option', (_, option) => {

        });
    } else {
        console.error("Other instance is already running: quitting app.");
        app.quit();
    }
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if (tray_icon && !tray_icon.isDestroyed()) {
        tray_icon.destroy();
    }
    if (main_window && !main_window.isDestroyed()) {
        main_window.destroy();
    }
})


