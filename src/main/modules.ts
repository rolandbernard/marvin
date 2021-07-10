
import { ModuleConfig, Config } from "common/config";
import { Result } from "common/result";
import { Query } from "common/query";
import { SystemCommandsModule } from "./modules/system-commands";

export const MODULES = {
    system_commands: new SystemCommandsModule(),
}

export type ModuleId = keyof typeof MODULES;

export interface Module<ModuleResult extends Result> {
    readonly config?: ModuleConfig;

    init?: (config: Config) => Promise<void>;
    update?: (config: Config) => Promise<void>;
    deinit?: (config: Config) => Promise<void>;

    search?: (config: Config, query: Query) => Promise<ModuleResult[]>;
    valid?: (config: Config, result: ModuleResult) => Promise<boolean>;
    execute?: (config: Config, result: ModuleResult) => Promise<void>;
}

