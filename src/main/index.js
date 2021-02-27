
import { app, globalShortcut, Tray, Menu } from 'electron';
import path from 'path';
import { loadConfig, config } from './config';
import { initModules, deinitModules } from './executor';
import { createMainWindow, destroyMainWindow, toggleMain } from './main';
import { createSettingsWindow, destroySettingsWindow, openSettingsWindow } from './modules/settings';

app.commandLine.appendSwitch("disable-gpu"); // Transparancy will not work without this

let tray;

async function startApp() {
    const got_single_instance_lock = app.requestSingleInstanceLock();
    if (got_single_instance_lock) {
        tray = new Tray(path.join(__static, 'logo.png'));
        const context_menu = Menu.buildFromTemplate([
            { label: 'Settings', type: 'normal', click: openSettingsWindow },
            { label: 'Quit', type: 'normal', click: closeApp },
        ]);
        tray.setToolTip('Marvin');
        tray.setContextMenu(context_menu);
        loadConfig();
        await initModules();
        createSettingsWindow();
        createMainWindow();
        const ret = globalShortcut.register(config.general.global_shortcut, toggleMain);
        if (!ret) {
            console.error('Failed to register a global shortcut');
            closeApp();
        }
    } else {
        console.error("Other instance is already running: quitting app.");
        closeApp();
    }
}

async function closeApp() {
    globalShortcut.unregisterAll();
    destroyMainWindow();
    destroySettingsWindow();
    await deinitModules();
    app.quit();
}

app.on('ready', () => setTimeout(startApp, 500));
app.on('before-exit', closeApp);
