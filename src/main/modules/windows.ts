
import { ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';
import { focusWindow, openWindows, updateWindowCache } from 'main/adapters/windows';

const MODULE_ID = 'windows';

interface WindowsResult extends SimpleResult {
    module: typeof MODULE_ID;
    window: string;
}

class WindowsConfig extends ModuleConfig {
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

    async search(query: Query): Promise<WindowsResult[]> {
        if (!this.last_load || (Date.now() - this.last_load) > 10000) {
            updateWindowCache();
            this.last_load = Date.now();
        }
        if (query.text.length > 0) {
            return (await openWindows()).map(window => ({
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: { url: window.icon },
                primary: window.title,
                secondary: window.application,
                quality: Math.max(
                    query.matchText(window.title),
                    query.matchText(window.application)
                ),
                autocomplete: this.config.prefix + window.title,
                window: window.window,
            }));
        } else {
            return [];
        }
    }

    async execute(result: WindowsResult) {
        focusWindow(result.window);
    }
}

