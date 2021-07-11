
import { Constructor } from 'lit-element';

import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module'
import { importAll } from 'common/util';

import { config } from 'main/config';
import { Platform, getPlatform } from 'main/platform';

export const modules: Record<ModuleId, Module<Result>> = { };

// This loads all typescript files in the modules directory
importAll(require.context('main/modules', true, /\.ts?$/));

export function registerModule(key: ModuleId, module: Module<any>) {
    modules[key] = module;
}

export function module(id: ModuleId, platform?: Platform | Platform[]) {
    const pf = getPlatform();
    if (!platform || platform === pf || platform.includes?.(pf)) {
        return (moduleClass: Constructor<Module<any>>) => {
            registerModule(id, new moduleClass());
        };
    } else {
        // If this platform is not supported by the module, don't add the module
        return () => {};
    }
}

export async function initModules() {
    for (const module of Object.values(modules)) {
        await module.init?.(config);
    }
}

export async function deinitModules() {
    for (const module of Object.values(modules)) {
        await module.deinit?.(config);
    }
}

