
import { Config, config, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { Result } from 'common/result';
import { Module } from 'common/module';

import { module } from 'main/modules';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'alias';

class AliasEntry extends Config {
    @configKind('text')
    name = '';

    @configKind('result')
    result?: Result;
}

class AliasConfig extends ModuleConfig {
    @configKind('boolean')
    prefix_text = true;

    @config({ kind: 'array', default: new AliasEntry() })
    aliases: AliasEntry[] = [];

    constructor() {
        super(false);
    }
}

@module(MODULE_ID)
export class AliasModule implements Module<Result> {
    readonly configs = AliasConfig;

    get config() {
        return moduleConfig<AliasConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<Result[]> {
        const aliases = this.config.aliases.filter(entry => entry.result);
        if (this.config.prefix_text) {
            return aliases.map(entry => ({
                ...entry.result!,
                primary: entry.name + ': ' + (entry.result as any).primary,
                text: entry.name + ': ' + (entry.result as any).text,
                query: query.text,
                quality: query.matchText(entry.name),
                autocomplete: this.config.prefix + entry.name,
            }));
        } else {
            return aliases.map(entry => ({
                ...entry.result!,
                query: query.text,
                quality: query.matchText(entry.name),
                autocomplete: this.config.prefix + entry.name,
            }));
        }
    }
}

