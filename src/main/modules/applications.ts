
import { basename } from 'path';

import { configKind, config as configDesc, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';
import { copyCase } from 'common/util';

import { executeApplication, getAllApplications, getDefaultDirectories, updateApplicationCache } from 'main/adapters/applications/applications';
import { getDefaultPath } from 'main/adapters/file-handler';
import { config, moduleConfig } from 'main/config';
import { module } from 'main/modules';

const MODULE_ID = 'applications';

interface ApplicationsResult extends SimpleResult {
    application: string;
}

class ApplicationsConfig extends ModuleConfig {
    @configKind('time')
    refresh_interval_min = time(30, TimeUnit.MINUTE);

    @configDesc({ kind: 'array', base: { kind: 'path', name: 'path' }, default: getDefaultPath() })
    directories = getDefaultDirectories();

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class ApplicationsModule implements Module<ApplicationsResult> {
    readonly configs = ApplicationsConfig;

    refresh?: NodeJS.Timeout;

    get config() {
        return moduleConfig<ApplicationsConfig>(MODULE_ID);
    }

    async init() {
        if (this.config.active) {
            await updateApplicationCache(this.config.directories);
            this.refresh = setTimeout(this.init.bind(this), this.config.refresh_interval_min);
        }
    }

    async update() {
        await this.deinit();
        await this.init();
    }

    async deinit() {
        clearTimeout(this.refresh!);
    }

    async search(query: Query): Promise<ApplicationsResult[]> {
        if (query.text.length > 0) {
            return (await getAllApplications()).map(application => {
                const app = basename(application.application);
                const name = application.name?.[config.general.language] ?? app;
                return {
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: { url: application.icon },
                    primary: '',
                    secondary: '',
                    quality: 0,
                    autocomplete: copyCase(name, query.raw),
                    application: application.application,
                };
            });
        } else {
            return [];
        }
    }

    async execute(result: ApplicationsResult) {
        executeApplication(result.application);
    }
}
