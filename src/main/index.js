import { app, globalShortcut, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

let mainWindow;
let settingsWindow;

function createMainWindow() {
    const window = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
        resizable: false,
        maximizable: false,
        minimizable: false,
        movable: false,
        skipTaskbar: true,
        center: true,
        frame: false,
        transparent: true,
    });
    
    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    if (isDevelopment) {
        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/main.html`);
    } else {
        window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'main.html'),
            protocol: 'file',
            slashes: true
        }));
    }

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

app.whenReady().then(() => {
    const ret = globalShortcut.register('Alt+Space', () => {
        mainWindow = createMainWindow();
    });
    if (!ret) {
        console.error('Failed to register global shortcuts');
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
})


