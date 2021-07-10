
import { GlobalConfig, ModuleConfig } from "common/config";
import { getTranslation } from "common/local/locale";
import { Query } from "common/query";
import { SimpleResult } from "common/result";
import { match } from "common/util";
import { Module, module } from "main/modules";

import { Command, executeSystemCommands, getSystemCommands } from "main/executors/system-commands";

class SystemCommandsResult extends SimpleResult {
    command: Command;

    constructor(quality: number, icon: string, primary: string, command: Command) {
        super('system_commands', quality, icon, primary);
        this.command = command;
    }
}

@module('system-command')
export class SystemCommandsModule implements Module<SystemCommandsResult> {
    readonly config = new ModuleConfig(true);

    async search(config: GlobalConfig, query: Query) {
        return getSystemCommands().map(command => new SystemCommandsResult(
            query.matchText(getTranslation(command, config)),
            match(command, {
                'shutdown': 'power_settings_new',
                'reboot': 'replay',
            }),
            getTranslation(command, config),
            command
        ))
    }

    async execute(_config: GlobalConfig, result: SystemCommandsResult) {
        executeSystemCommands(result.command);
    }
}

