
import { ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { copyCase } from 'common/util';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';
import { focusWindow, openWindows } from 'main/adapters/windows';

const MODULE_ID = 'windows';

interface WindowsResult extends SimpleResult {
    module: typeof MODULE_ID;
    window: unknown;
}

class WindowsConfig extends ModuleConfig {
    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class WindowsModule implements Module<WindowsResult> {
    readonly configs = WindowsConfig;

    get config() {
        return moduleConfig<WindowsConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<WindowsResult[]> {
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
                autocomplete: copyCase(this.config.prefix + window.title, query.raw),
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

