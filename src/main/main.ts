
import { app } from 'electron';

import { loadConfig } from 'main/config';
import { initModules, deinitModules } from 'main/modules';
import { getPlatform, isDevelopment, Platform } from 'main/platform';

async function startApp() {
    if (getPlatform() === Platform.UNSUPPORTED) {
        console.error("This platform is not supported! Some features will not work.");
    }
    const single_instance = app.requestSingleInstanceLock();
    if (single_instance || isDevelopment()) {
        await loadConfig();
        await initModules();
    } else {
        console.error("Other instance is already running: quitting app.");
        app.quit();
    }
}

async function closeApp() {
    await deinitModules();
}

app.on('ready', startApp);
app.on('before-quit', closeApp);

