
import { readFile, writeFile } from 'fs/promises';
import { app } from "electron";
import { join } from 'path';

import { GlobalConfig } from 'common/config';
import { mergeDeep } from 'common/util';

import { modules } from 'main/modules';

export const config = new GlobalConfig(modules);

const config_path = join(app.getPath('userData'), 'marvin.json');

export async function loadConfig() {
    try {
        const old_config = JSON.parse(await readFile(config_path, { encoding: 'utf8' }));
        delete old_config.version;
        mergeDeep(config, old_config);
    } catch (e) {
        // Ignore errors, keep default config
    }
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

