
import { app, globalShortcut } from 'electron';
import { loadConfig, config } from './config';
import { initModules, deinitModules } from './executor';
import { createMainWindow, destroyMainWindow, toggleMain } from './main';
import { createSettingsWindow, destroySettingsWindow } from './modules/settings';

app.commandLine.appendSwitch("disable-gpu"); // Transparancy will not work without this

async function startApp() {
    const gotSingleInstanceLock = app.requestSingleInstanceLock();
    if (gotSingleInstanceLock) {
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
