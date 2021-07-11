
import { ModuleConfig, GlobalConfig } from 'common/config';
import { Result } from 'common/result';
import { Query } from 'common/query';

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

