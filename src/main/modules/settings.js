
import { stringMatchQuality } from '../search';
import { BrowserWindow, ipcMain } from "electron";
import path from 'path';
import { getTranslation, getAllTranslation } from "../../common/local/locale";
import { config, updateConfig, CONFIG_DEFAULT } from '../config';
import { updateModules } from '../executor';

const isDevelopment = process.env.NODE_ENV !== 'production';

let settings_window;

async function configUpdated(new_config) {
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
    await updateConfig(new_config);
    await updateModules(old_config);
}

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
        settings_window.loadURL(`file://${path.join(__dirname, 'settings.html')}`);
    }

    const hideWindow = (e) => {
        e.preventDefault();
        settings_window.hide();
    };

    settings_window.on('close', hideWindow);
    settings_window.removeMenu();

    ipcMain.on('update-config', (_, new_config) => {
        configUpdated(new_config);
    });
    ipcMain.on('reset-config', (_) => {
        configUpdated(CONFIG_DEFAULT);
        settings_window.webContents.send('update-config', config);
    });
}

export function destroySettingsWindow() {
    if (settings_window && !settings_window.isDestroyed()) {
        settings_window.destroy();
    }
}

export function openSettingsWindow() {
    settings_window.webContents.send('update-config', config);
    settings_window.show();
    settings_window.focus();
}

const SettingsModule = {
    init: async () => {
        createSettingsWindow();
    },
    deinit: async () => {
        destroySettingsWindow();
    },
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query, regex) => {
        const language = config.general.language;
        const settings_match = Math.max(...(
            getAllTranslation('settings').map(([trans, lang]) => (lang === language ? 1 : 0.5) * stringMatchQuality(query, trans, regex))
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
    execute: async (_) => {
        openSettingsWindow();
    },
}

export default SettingsModule;
