
import { Config, config, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { copyCase } from 'common/util';

import { module } from 'main/modules';
import { moduleConfig } from 'main/config';
import { CommandMode, executeCommand } from 'main/adapters/commands';

const MODULE_ID = 'scripts';

interface ScriptResult extends SimpleResult {
    module: typeof MODULE_ID;
    command: string;
    mode: CommandMode;
}

class ScriptEntry extends Config {
    @configKind('text')
    name = '';

    @configKind('code')
    script = '';

    @configKind('boolean')
    execute_in_terminal = false;

    @configKind('quality')
    default_quality = 0;
}

class ScriptConfig extends ModuleConfig {
    @config({ kind: 'array', default: new ScriptEntry() })
    entries: ScriptEntry[] = [];

    constructor() {
        super(false);
    }
}

@module(MODULE_ID)
export class ScriptModule implements Module<ScriptResult> {
    readonly configs = ScriptConfig;

    get config() {
        return moduleConfig<ScriptConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<ScriptResult[]> {
        return this.config.entries.map(entry => ({
            module: MODULE_ID,
            query: query.text,
            kind: 'simple-result',
            primary: entry.name,
            secondary: entry.script.replace(/\n/g, '; '),
            quality: query.text.length > 0
                ? query.matchText(entry.name)
                : entry.default_quality,
            autocomplete: copyCase(this.config.prefix + entry.name, query.raw),
            command: entry.script,
            mode: entry.execute_in_terminal ? CommandMode.TERMINAL : CommandMode.SHELL,
        }));
    }

    async execute(result: ScriptResult) {
        executeCommand(result.command, result.mode);
    }
}

