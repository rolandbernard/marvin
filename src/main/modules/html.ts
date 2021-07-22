
import { Config, config, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { HtmlResult } from 'common/result';
import { Module } from 'common/module';
import { copyCase } from 'common/util';

import { module } from 'main/modules';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'html';

class HtmlEntry extends Config {
    @configKind('text')
    name = '';

    @configKind('code')
    html = '';

    @configKind('quality')
    default_quality = 0;
}

class HtmlConfig extends ModuleConfig {
    @config({ kind: 'array', default: new HtmlEntry() })
    entries: HtmlEntry[] = [];

    constructor() {
        super(false);
    }
}

@module(MODULE_ID)
export class HtmlModule implements Module<HtmlResult> {
    readonly configs = HtmlConfig;

    get config() {
        return moduleConfig<HtmlConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<HtmlResult[]> {
        return this.config.entries.map(entry => ({
            module: MODULE_ID,
            query: query.text,
            kind: 'html-result',
            html: entry.html,
            quality: query.text.length > 0
                ? query.matchText(entry.name)
                : entry.default_quality,
            autocomplete: copyCase(this.config.prefix + entry.name, query.raw),
        }));
    }
}

