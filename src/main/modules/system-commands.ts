
import { ModuleConfig } from 'common/config';
import { getTranslation } from 'common/local/locale';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { match } from 'common/util';
import { Module } from 'common/module';

import { config, moduleConfig } from 'main/config';
import { module } from 'main/modules';
import { Command, executeSystemCommands } from 'main/adapters/system-commands';

const MODULE_ID = 'system_commands';

interface SystemCommandsResult extends SimpleResult {
    module: typeof MODULE_ID;
    command: Command;
}

class SystemCommandsConfig extends ModuleConfig {
    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class SystemCommandsModule implements Module<SystemCommandsResult> {
    readonly configs = SystemCommandsConfig;

    get config() {
        return moduleConfig<SystemCommandsConfig>(MODULE_ID);
    }

    itemForCommand(query: Query, command: Command): SystemCommandsResult {
        const name = getTranslation(command, config);
        return {
            module: MODULE_ID,
            kind: 'simple-result',
            query: query.text,
            quality: query.matchText(name),
            icon: {
                material: match(command, {
                    'shutdown': 'power_settings_new',
                    'reboot': 'replay',
                })
            },
            primary: name,
            autocomplete: this.config.prefix + name,
            command: command,
        };
    }

    async search(query: Query): Promise<SystemCommandsResult[]> {
        if (query.text.length > 0) {
            return Object.values(Command).map(command => this.itemForCommand(query, command));
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: SystemCommandsResult): Promise<SystemCommandsResult | undefined> {
        return this.itemForCommand(query, result.command);
    }

    async execute(result: SystemCommandsResult) {
        executeSystemCommands(result.command);
    }
}

