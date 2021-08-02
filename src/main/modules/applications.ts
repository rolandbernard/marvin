
import { ipcMain } from 'electron';
import { basename, dirname } from 'path';

import { configKind, config as configDesc, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';
import { IpcChannels } from 'common/ipc';

import { Application, executeApplication, getAllApplications, getDefaultDirectories, updateApplicationCache } from 'main/adapters/applications/applications';
import { getDefaultPath } from 'main/adapters/file-handler';
import { config, moduleConfig } from 'main/config';
import { module, moduleForId } from 'main/modules';

const MODULE_ID = 'applications';

interface ApplicationsResult extends SimpleResult {
    module: typeof MODULE_ID;
    application: unknown;
    app_id: string;
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
            action: IpcChannels.REFRESH_APPLICATIONS,
            confirm: false,
        });
    }
}

ipcMain.on(IpcChannels.REFRESH_APPLICATIONS, () => {
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

    forLanguage(names?: Record<string, string>): string | undefined {
        return names?.[config.general.language]
            ?? names?.['default']
            ?? Object.values(names ?? {})[0];
    }

    itemForApplication(query: Query, application: Application): ApplicationsResult {
        const name = this.forLanguage(application.name) ?? basename(application.file);
        const action = this.forLanguage(application.action);
        const filename = basename(dirname(application.file)) + ' › ' + basename(application.file);
        const description = this.forLanguage(application.description) ?? filename;
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
                query.matchAny(Object.values(application.description ?? {}), description) * 0.5,
                query.matchAny(Object.values(application.other ?? {}).flat()) * 0.5,
                query.matchText(application.file) * 0.5,
            ),
            autocomplete: this.config.prefix + name,
            application: application.application,
            app_id: application.id,
        };
    }

    async search(query: Query): Promise<ApplicationsResult[]> {
        if (query.text.length > 0) {
            return (await getAllApplications()).map(application => this.itemForApplication(query, application));
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: ApplicationsResult): Promise<ApplicationsResult | undefined> {
        const application = (await getAllApplications()).find(app => app.id === result.app_id);
        return application && this.itemForApplication(query, application);
    }

    async execute(result: ApplicationsResult) {
        executeApplication(result.application);
    }
}

