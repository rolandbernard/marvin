
import { app } from 'electron';

import { getPlatform, isDevelopment, Platform } from 'common/platform';

import { runMatch } from 'common/util';

import { loadConfig } from 'main/config';
import { initModules, deinitModules, moduleForId } from 'main/modules';
import { initGlobalIpc, GlobalIpcCommand } from 'main/global-ipc';
import { MainModule } from 'main/modules/main';
import { SettingsModule } from 'main/modules/settings';

import 'main/renderer-ipc';

async function handleIpcCommand(cmd: GlobalIpcCommand) {
    return runMatch(cmd.kind, {
        'show': () => {
            moduleForId<MainModule>('main')?.showWindow();
        },
        'toggle': () => {
            moduleForId<MainModule>('main')?.toggleWindow();
        },
        'hide': () => {
            moduleForId<MainModule>('main')?.hideWindow();
        },
        'settings': () => {
            moduleForId<SettingsModule>('settings')?.showWindow();
        },
        'quit': () => {
            app.quit();
        },
    });
}

async function startApp() {
    if (getPlatform() === Platform.UNSUPPORTED) {
        console.error('This platform is not supported! Some features will not work.');
    }
    const single_instance = app.requestSingleInstanceLock();
    if (single_instance || isDevelopment()) {
        try {
            await initGlobalIpc(handleIpcCommand);
        } catch (e) {
            console.error('Failed to start IPC server.');
        }
        await loadConfig();
        await initModules();
    } else {
        console.error('Other instance is already running: quitting app.');
        app.quit();
    }
}

async function closeApp() {
    await deinitModules();
}

app.on('ready', startApp);
app.on('before-quit', closeApp);

