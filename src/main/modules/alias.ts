
import { Config, config, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { Result } from 'common/result';
import { Module } from 'common/module';

import { module, moduleForId } from 'main/modules';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'alias';

class AliasEntry extends Config {
    @configKind('text')
    name = '';

    @configKind('result')
    result?: Result;

    @configKind('boolean')
    prefix_text = true;

    @configKind('quality')
    default_quality = 0;
}

class AliasConfig extends ModuleConfig {
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

    async rebuildEntries(query: Query) {
        const aliases = this.config.aliases.filter(entry => entry.result);
        for (const entry of aliases) {
            const module = moduleForId(entry.result!.module);
            if (module) {
                if (module.rebuild) {
                    entry.result = await module.rebuild(query, entry.result!);
                }
            } else {
                delete entry.result;
            }
        }
    }

    async search(query: Query): Promise<Result[]> {
        await this.rebuildEntries(query);
        const aliases = this.config.aliases.filter(entry => entry.result);
        return aliases.map(entry => {
            const match = query.text.length > 0 ? query.matchText(entry.name) : entry.default_quality;
            if (entry.prefix_text) {
                return {
                    ...entry.result!,
                    primary: entry.name + ': ' + (entry.result as any).primary,
                    text: entry.name + ': ' + (entry.result as any).text,
                    query: query.text,
                    quality: match,
                    autocomplete: this.config.prefix + entry.name,
                };
            } else {
                return {
                    ...entry.result!,
                    query: query.text,
                    quality: match,
                    autocomplete: this.config.prefix + entry.name,
                };
            }
        });
    }
}

