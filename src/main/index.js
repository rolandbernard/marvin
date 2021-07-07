
import { app } from 'electron';
import { loadConfig } from './config';
import { initModules, deinitModules } from './executor';

app.commandLine.appendSwitch("disable-gpu"); // Transparency will not work without this

async function startApp() {
    const got_single_instance_lock = app.requestSingleInstanceLock();
    if (got_single_instance_lock) {
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

app.on('ready', () => setTimeout(startApp, 500));
app.on('before-quit', closeApp);
