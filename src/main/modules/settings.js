
import { stringMatchQuality } from "../../common/util";
import { BrowserWindow, ipcMain } from "electron";
import { format as formatUrl } from 'url';
import path from 'path';
import { getTranslation, getAllTranslation } from "../../common/local/locale";
import { config, updateConfig, CONFIG_DEFAULT } from '../config';
import { updateModules } from '../executor';

const isDevelopment = process.env.NODE_ENV !== 'production';

let settings_window;

export function createSettingsWindow() {
    settings_window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        skipTaskbar: true,
        center: true,
        show: false,
        width: config.general.width * 2,
        icon: path.join(__static, 'logo.png'),
        paintWhenInitiallyHidden: true,
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

    async function updateConfigHelper(new_config) {
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
    }
    ipcMain.on('update-config', (_, new_config) => {
        updateConfigHelper(new_config);
    });
    ipcMain.on('reset-config', (_) => {
        updateConfigHelper(CONFIG_DEFAULT);
        settings_window.webContents.send('update-config', config);
    });
}

export function destroySettingsWindow() {
    if (settings_window && !settings_window.isDestroyed()) {
        settings_window.destroy();
    }
}

const SettingsModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query, regex) => {
        const settings_match = Math.max(...(
            getAllTranslation('settings').map((trans) => stringMatchQuality(query, trans, regex))
        ));
        return [{
            type: 'icon_list_item',
            material_icon: 'settings',
            primary: getTranslation(config, 'settings'),
            secondary: null,
            executable: true,
            quality: settings_match,
        }];
    },
    execute: async (option) => {
        settings_window.webContents.send('update-config', config);
        settings_window.show();
        settings_window.focus();
    },
}

export default SettingsModule;
