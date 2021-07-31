
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

    itemForCommandAndMode(query: Query, command: string, mode: CommandMode): CommandResult {
        const name = mode === CommandMode.TERMINAL
            ? getTranslation('execute_in_terminal', config)
            : getTranslation('execute', config);
        return {
            module: MODULE_ID,
            query: query.text,
            kind: 'simple-result',
            icon: { material: 'code' },
            primary: command,
            secondary: `${name}: ${query.text}`,
            quality: this.config.quality,
            command: command,
            mode: CommandMode.TERMINAL,
        };
    }

    async search(query: Query): Promise<CommandResult[]> {
        if (query.text.length > 0) {
            return [
                this.itemForCommandAndMode(query, query.text, CommandMode.TERMINAL),
                this.itemForCommandAndMode(query, query.text, CommandMode.SIMPLE),
            ];
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: CommandResult): Promise<CommandResult | undefined> {
        return this.itemForCommandAndMode(query, result.command, result.mode);
    }

    async execute(result: CommandResult) {
        executeCommand(result.command, result.mode);
    }
}

