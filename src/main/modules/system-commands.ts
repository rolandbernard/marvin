
import { ModuleConfig } from 'common/config';
import { getTranslation } from 'common/local/locale';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { match } from 'common/util';
import { Module } from 'common/module';

import { config } from 'main/config';
import { module } from 'main/modules';
import { Command, executeSystemCommands } from 'main/adapters/system-commands';

const MODULE_ID = 'system_commands';

interface SystemCommandsResult extends SimpleResult {
    command: Command;
}

@module(MODULE_ID)
export class SystemCommandsModule implements Module<SystemCommandsResult> {
    readonly config = new ModuleConfig(true);

    async search(query: Query): Promise<SystemCommandsResult[]> {
        return Object.values(Command).map(command => ({
            kind: 'simple-result',
            module: MODULE_ID,
            quality: query.matchText(getTranslation(command, config)),
            icon: {
                material: match(command, {
                    'shutdown': 'power_settings_new',
                    'reboot': 'replay',
                })
            },
            primary: getTranslation(command, config),
            command: command
        }));
    }

    async execute(result: SystemCommandsResult) {
        executeSystemCommands(result.command);
    }
}

