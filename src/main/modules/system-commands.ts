
import { ModuleConfig } from 'common/config';
import { getTranslation } from 'common/local/locale';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { copyCase, match } from 'common/util';
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
    readonly config = new ModuleConfig();

    async search(query: Query): Promise<SystemCommandsResult[]> {
        if (query.text.length > 0) {
            return Object.values(Command).map(command => {
                const name = getTranslation(command, config);
                return {
                    module: MODULE_ID,
                    kind: 'simple-result',
                    quality: query.matchText(name),
                    icon: {
                        material: match(command, {
                            'shutdown': 'power_settings_new',
                            'reboot': 'replay',
                        })
                    },
                    primary: name,
                    autocomplete: copyCase(name, query.text),
                    command: command,
                };
            });
        } else {
            return [];
        }
    }

    async execute(result: SystemCommandsResult) {
        executeSystemCommands(result.command);
    }
}

