
import { ipcMain } from 'electron';
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
import { module, moduleForId } from 'main/modules';

const MODULE_ID = 'applications';

interface ApplicationsResult extends SimpleResult {
    module: typeof MODULE_ID;
    application: unknown;
}

class ApplicationsConfig extends ModuleConfig {
    @configKind('time')
    refresh_interval_min = time(30, TimeUnit.MINUTE);

    @configDesc({ kind: 'array', base: { kind: 'path', name: 'path' }, default: getDefaultPath() })
    directories = getDefaultDirectories();

    constructor() {
        super(true);
        this.addConfigField({
            kind: 'button',
            name: 'refresh_applications',
            action: 'refresh-applications',
            confirm: false,
        });
    }
}

ipcMain.on('refresh-applications', () => {
    moduleForId<ApplicationsModule>(MODULE_ID)?.refreshApplications();
});

@module(MODULE_ID)
export class ApplicationsModule implements Module<ApplicationsResult> {
    readonly configs = ApplicationsConfig;

    refresh?: NodeJS.Timer;

    get config() {
        return moduleConfig<ApplicationsConfig>(MODULE_ID);
    }

    refreshApplications() {
        return updateApplicationCache(this.config.directories);
    }

    async init() {
        if (this.config.active) {
            this.refreshApplications();
            this.refresh = setInterval(() => {
                this.refreshApplications();
            }, this.config.refresh_interval_min);
        }
    }

    async update() {
        await this.deinit();
        await this.init();
    }

    async deinit() {
        clearInterval(this.refresh!);
    }

    async search(query: Query): Promise<ApplicationsResult[]> {
        function forLanguage(names?: Record<string, string>): string | undefined {
            return names?.[config.general.language]
                ?? names?.['default']
                ?? Object.values(names ?? {})[0];
        }
        if (query.text.length > 0) {
            return (await getAllApplications()).map(application => {
                const name = forLanguage(application.name) ?? basename(application.file);
                const action = forLanguage(application.action);
                const description = forLanguage(application.description) ?? application.file;
                const is_action = action && action !== name;
                return {
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: { url: application.icon },
                    primary: is_action ? action! : name,
                    secondary: is_action ? name : description,
                    quality: Math.max(
                        query.matchAny(Object.values(application.name ?? {}), name),
                        query.matchAny(Object.values(application.action ?? {}), action) * 0.75,
                        query.matchAny(Object.values(application.description ?? {}), name) * 0.5,
                        query.matchAny(Object.values(application.other ?? {}).flat()) * 0.5,
                        query.matchText(application.file) * 0.5,
                    ),
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

