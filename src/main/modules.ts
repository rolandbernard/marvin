
import { Constructor } from 'lit-element';

import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module'
import { Translatable } from 'common/local/locale';
import { importAll } from 'common/util';
import { Platform, getPlatform } from 'common/platform';

export const modules: Record<ModuleId, Module<Result>> = { };

// This loads all typescript files in the modules directory
importAll(require.context('./modules', true, /\.ts$/));

export function registerModule(key: ModuleId, module: Module<any>) {
    modules[key] = module;
}

export function module(id: Translatable, platform?: Platform | Platform[]) {
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

export function moduleForId<Type extends Module<any>>(id: ModuleId): Type | undefined {
    // Assert that the type is correct. This simplifies using this function.
    return modules[id] as Type;
}

export async function initModules() {
    for (const module of Object.values(modules)) {
        await module.init?.().catch(() => { /* Ignore errors */ });
    }
}

export async function updateModules() {
    for (const module of Object.values(modules)) {
        await module.update?.().catch(() => { /* Ignore errors */ });
    }
}

export async function deinitModules() {
    for (const module of Object.values(modules)) {
        await module.deinit?.().catch(() => { /* Ignore errors */ });
    }
}

