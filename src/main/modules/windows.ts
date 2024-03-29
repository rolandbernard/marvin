
import { ModuleConfig, configKind } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { time, TimeUnit } from 'common/time';

import { Module } from 'common/module';
import { moduleConfig } from 'main/config';
import { module } from 'main/modules';
import { focusWindow, openWindows, updateWindowCache, Window } from 'main/adapters/windows';

const MODULE_ID = 'windows';

interface WindowsResult extends SimpleResult {
    module: typeof MODULE_ID;
    window: string;
}

class WindowsConfig extends ModuleConfig {
    @configKind('time')
    refresh_interval_min = time(1, TimeUnit.SECOND);
    
    @configKind('quality')
    default_quality = 0;

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class WindowsModule implements Module<WindowsResult> {
    readonly configs = WindowsConfig;

    last_load?: number;

    get config() {
        return moduleConfig<WindowsConfig>(MODULE_ID);
    }   

    async init() {
        if (this.config.active) {
            this.refresh();
        }
    }
    
    async update() {
        await this.init();
    }
    
    async refresh() {
        if (!this.last_load || (Date.now() - this.last_load) > this.config.refresh_interval_min) {
            this.last_load = Date.now();
            await updateWindowCache();
        }
    }

    itemForWindow(query: Query, window: Window): WindowsResult {
        return {
            module: MODULE_ID,
            query: query.text,
            kind: 'simple-result',
            icon: { url: window.icon },
            primary: window.title,
            secondary: window.application,
            quality: query.text.length == 0
                ? this.config.default_quality
                : Math.max(
                    query.matchText(window.title),
                    query.matchText(window.application) * 0.75
                ),
            autocomplete: this.config.prefix + window.title,
            window: window.window,
        };
    }

    async search(query: Query): Promise<WindowsResult[]> {
        if (query.text.length > 0) {
            return (await openWindows()).map(window => this.itemForWindow(query, window));
        } else if (this.config.default_quality > 0) {
            return (await openWindows()).map(window => this.itemForWindow(query, window));
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: WindowsResult): Promise<WindowsResult | undefined> {
        const window = (await openWindows()).find(win => win.window === result.window);
        return window && this.itemForWindow(query, window);
    }

    async execute(result: WindowsResult) {
        focusWindow(result.window);
    }
}

