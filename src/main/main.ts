
import { app } from 'electron';

import { loadConfig } from 'main/config';
import { initModules, deinitModules } from 'main/modules';

async function startApp() {
    const single_instance = app.requestSingleInstanceLock();
    if (single_instance) {
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

