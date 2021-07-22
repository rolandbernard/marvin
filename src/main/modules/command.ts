
import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { getTranslation } from 'common/local/locale';

import { module } from 'main/modules';
import { config, moduleConfig } from 'main/config';
import { CommandMode, executeCommand } from 'main/adapters/commands';

const MODULE_ID = 'command';

interface CommandResult extends SimpleResult {
    module: typeof MODULE_ID;
    command: string;
    mode: CommandMode;
}

class CommandConfig extends ModuleConfig {
    @configKind('quality')
    quality = 1;

    constructor() {
        super(true, '>');
    }
}

@module(MODULE_ID)
export class CommandModule implements Module<CommandResult> {
    readonly configs = CommandConfig;

    get config() {
        return moduleConfig<CommandConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<CommandResult[]> {
        if (query.text.length > 0) {
            return [
                {
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: { material: 'code' },
                    primary: query.text,
                    secondary: `${getTranslation('execute_in_terminal', config)}: ${query.text}`,
                    quality: this.config.quality,
                    command: query.text,
                    mode: CommandMode.TERMINAL,
                },
                {
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: { material: 'code' },
                    primary: query.text,
                    secondary: `${getTranslation('execute', config)}: ${query.text}`,
                    quality: this.config.quality,
                    command: query.text,
                    mode: CommandMode.SHELL,
                },
            ];
        } else {
            return [];
        }
    }

    async execute(result: CommandResult) {
        executeCommand(result.command, result.mode);
    }
}

