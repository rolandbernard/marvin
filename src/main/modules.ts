
import { Constructor } from 'lit-element';

import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module'
import { importAll } from 'common/util';

import { config } from 'main/config';

export const modules: Record<ModuleId, Module<Result>> = { };

// This loads all typescript files in the modules directory
importAll(require.context('main/modules', true, /\.ts?$/));

export function registerModule(key: ModuleId, module: Module<any>) {
    modules[key] = module;
}

export function module(id: ModuleId) {
    return (moduleClass: Constructor<Module<any>>) => {
        registerModule(id, new moduleClass());
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

