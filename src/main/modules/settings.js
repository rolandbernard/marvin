
import { stringMatchQuality } from "../../common/util";
import { config } from '../config';
import { BrowserWindow } from "electron";
import path from 'path';
import transalations from "../../common/local/locale";

const isDevelopment = process.env.NODE_ENV !== 'production';

let settings_window;

export function createSettingsWindow() {
    settings_window = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
        skipTaskbar: true,
        center: true,
        show: false,
        icon: path.join(__static, 'logo.ico'),
    });

    if (isDevelopment) {
        settings_window.webContents.openDevTools();
    }

    if (isDevelopment) {
        settings_window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/settings.html`);
    } else {
        settings_window.loadURL(formatUrl({
            pathname: path.join(__dirname, 'settings.html'),
            protocol: 'file',
            slashes: true
        }));
    }

    const hideWindow = (e) => {
        e.preventDefault();
        settings_window.hide();
    };

    settings_window.on('close', hideWindow);
    settings_window.removeMenu();
}

const SettingsModule = {
    valid: (query) => {
        return query.length >= 1;
    },
    search: async (query) => {
        return [{
            type: 'icon_list_item',
            material_icon: 'settings',
            primary: transalations[config.general.language].settings,
            secondary: 'Test 1 2 3',
            executable: true,
            quality: stringMatchQuality(query, transalations[config.general.language].settings),
        }];
    },
    execute: async (option) => {
        settings_window.webContents.send('reset', config);
        settings_window.show();
        settings_window.focus();
    },
}

export default SettingsModule;
