
import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

import { Module } from 'common/module';
import { getPlatform, isDevelopment } from 'common/platform';
import { IpcChannels } from 'common/ipc';

import { config, updateConfig } from 'main/config';
import { module } from 'main/modules';
import { openUrl } from 'main/adapters/url-handler';

autoUpdater.logger = null;

async function checkForUpdate() {
    config.update.can_update = false;
    config.update.checking = true;
    await updateConfig();
    try {
        const result = await autoUpdater.checkForUpdates();
        if (result) {
            config.update.latest = result.updateInfo.version;
            config.update.can_update = autoUpdater.currentVersion.compare(result.updateInfo.version) < 0;
        }
    } catch (e) {
        // Ignore errors?
    } finally {
        config.update.checking = false;
    }
    await updateConfig();
}

ipcMain.on(IpcChannels.OPEN_UPDATE, () => {
    openUrl('https://github.com/rolandbernard/marvin/releases/latest');
});

ipcMain.on(IpcChannels.CHECK_FOR_UPDATE, async (msg) => {
    if (!isDevelopment()) {
        await checkForUpdate();
        msg.sender.send(IpcChannels.SHOW_WINDOW, config, config.getDescription());
    }
});

ipcMain.on(IpcChannels.INSTALL_UPDATE, async () => {
    if (!isDevelopment()) {
        config.update.updating = true;
        await updateConfig();
        try {
            await checkForUpdate();
            await autoUpdater.downloadUpdate();
            autoUpdater.quitAndInstall();
        } catch (e) {
            // Ignore errors?
        } finally {
            config.update.updating = false;
        }
        await updateConfig();
    }
});

const MODULE_ID = 'updates';

@module(MODULE_ID as any) // This module has no config => needs no translation
export class UpdateModule implements Module<any> {

    async init() {
        const version = autoUpdater.currentVersion;
        config.update.version = version.version;
        if (version.compare(config.update.latest) > 0) {
            config.update.latest = version.version;
        }
        config.update.platform = getPlatform();
        config.update.can_update = autoUpdater.currentVersion.compare(config.update.latest) < 0;
        await this.update();
    }

    async update() {
        if (isDevelopment() || !config.update.auto_update) {
            autoUpdater.autoDownload = false;
            autoUpdater.autoInstallOnAppQuit = false;
        } else {
            autoUpdater.autoDownload = true;
            autoUpdater.autoInstallOnAppQuit = true;
            await checkForUpdate();
        }
    }
}

