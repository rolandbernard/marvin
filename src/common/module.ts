
import { ModuleConfig } from 'common/config';
import { Result } from 'common/result';
import { Query } from 'common/query';

export interface Module<ModuleResult extends Result> {
    readonly configs?: new () => ModuleConfig;
    readonly local?: boolean; // All modules that can not run in a worker thread should set this to true.

    init?: () => Promise<void>;
    update?: () => Promise<void>;
    deinit?: () => Promise<void>;

    search?: (query: Query) => Promise<ModuleResult[]>;
    refresh?: () => Promise<unknown>;
    rebuild?: (query: Query, result: ModuleResult) => Promise<ModuleResult | undefined>;
    execute?: (result: ModuleResult) => Promise<void>;
    executeAny?: (result: Result) => Promise<void>;
}

export type ModuleId = string;

