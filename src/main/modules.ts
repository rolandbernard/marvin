
import { Constructor } from 'lit-element';

import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module'
import { importAll } from 'common/util';

const modules: Record<ModuleId, Module<Result>> = { };

export function registerModule(key: ModuleId, module: Module<any>) {
    modules[key] = module;
}

export function loadModules() {
    importAll(require.context('main/modules', true, /\.ts?$/));
    return modules;
}

export function module(id: ModuleId) {
    return (moduleClass: Constructor<Module<any>>) => {
        registerModule(id, new moduleClass());
    }
}

