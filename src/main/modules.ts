
import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module'
import { Translatable } from 'common/local/locale';
import { importAll, Constructor } from 'common/util';
import { Platform, getPlatform } from 'common/platform';

import { config } from 'main/config';
import { initModule, updateModule, deinitModule } from 'main/execution/workers';

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

export function moduleForId<Type extends Module<any> = Module<Result>>(id: ModuleId): Type | undefined {
    // Assert that the type is correct. This simplifies using this function.
    return modules[id] as Type;
}

export function forActiveModules(op: (id: ModuleId) => unknown): Promise<unknown> {
    return Promise.all(
        Object.keys(modules)
            .filter(id => !config.modules[id] || config.modules[id]!.active)
            .map(op)
    );
}

export function forAllModules(op: (id: ModuleId) => unknown): Promise<unknown> {
    return Promise.all(Object.keys(modules).map(op));
}

export async function initModules() {
    await forAllModules(module => initModule(module));
}

export async function updateModules() {
    await forAllModules(module => updateModule(module));
}

export async function deinitModules() {
    await forAllModules(module => deinitModule(module));
}

