import { app, globalShortcut, BrowserWindow, Tray, Menu } from 'electron';
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
        width: 1750,
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
        tray_icon = new Tray(path.join(__static, 'logo.png'));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Item1', click: () => {
                    app.quit();
                },
            },
        ]);
        tray_icon.setToolTip('This is my application.');
        tray_icon.setContextMenu(contextMenu);

        setTimeout(() => {
            createMainWindow();
        }, 1000);

        const ret = globalShortcut.register('Super+D', () => {
            if (main_window && !main_window.isDestroyed()) {
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
    } else {
        logger.error("Other instance is already running: quitting app.");
        quitApp();
    }
});

app.on("window-all-closed", () => {
    app.quit();
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
    if(tray_icon && !tray_icon.isDestroyed()) {
        tray_icon.destroy();
    }
    if(main_window && !main_window.isDestroyed()) {
        main_window.destroy();
    }
})


