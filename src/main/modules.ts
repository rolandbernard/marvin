
import { Constructor } from "lit-element";

import { ModuleConfig, GlobalConfig } from "common/config";
import { Result } from "common/result";
import { Query } from "common/query";
import { importAll } from "common/util";

export interface Module<ModuleResult extends Result> {
    readonly config?: ModuleConfig;

    init?: (config: GlobalConfig) => Promise<void>;
    update?: (config: GlobalConfig) => Promise<void>;
    deinit?: (config: GlobalConfig) => Promise<void>;

    search?: (config: GlobalConfig, query: Query) => Promise<ModuleResult[]>;
    valid?: (config: GlobalConfig, result: ModuleResult) => Promise<boolean>;
    execute?: (config: GlobalConfig, result: ModuleResult) => Promise<void>;
}

export type ModuleId = string;

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

