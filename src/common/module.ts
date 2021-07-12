
import { ModuleConfig } from 'common/config';
import { Result } from 'common/result';
import { Query } from 'common/query';

export interface Module<ModuleResult extends Result> {
    readonly config?: ModuleConfig;

    init?: () => Promise<void>;
    update?: () => Promise<void>;
    deinit?: () => Promise<void>;

    search?: (query: Query) => Promise<ModuleResult[]>;
    valid?: (result: ModuleResult) => Promise<boolean>;
    execute?: (result: ModuleResult) => Promise<void>;
}

export type ModuleId = string;

