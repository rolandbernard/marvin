
import { readFile, writeFile } from 'fs/promises';
import { app } from "electron";
import { join } from 'path';

import { GlobalConfig } from 'common/config';
import { mergeDeep } from 'common/util';

import { modules } from 'main/modules';

export let config: GlobalConfig;

const config_path = join(app.getPath('userData'), 'new-marvin.json');

export async function loadConfig() {
    // Modules are already registered, create a default config for them
    config = new GlobalConfig(modules);
    try {
        const old_config = JSON.parse(await readFile(config_path, { encoding: 'utf8' }));
        // The version and platform must not be overwritten!
        delete old_config.version;
        delete old_config.platform;
        mergeDeep(config, old_config);
    } catch (e) {
        // Ignore errors, keep default config
    }
    await updateConfig();
}

export async function resetConfig() {
    config = new GlobalConfig(modules);
    await updateConfig();
}

export async function updateConfig(new_config?: GlobalConfig) {
    if (new_config) {
        mergeDeep(config, new_config);
    }
    try {
        await writeFile(config_path, JSON.stringify(config), { encoding: 'utf8' })
    } catch (e) {
        // Ignore errors, simply don't write the config
    }
}

