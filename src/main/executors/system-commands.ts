
import { runMatch } from 'common/util';

import { executeCommand } from 'main/executors/commands';

export enum Command {
    SHUTDOWN = 'shutdown',
    REBOOT   = 'reboot',
}

export function getSystemCommands(): Command[] {
    return [ Command.SHUTDOWN, Command.REBOOT ];
}

export function executeSystemCommands(command: Command) {
    runMatch(command, {
        'shutdown': () => executeCommand('shutdown now || systemctl poweroff'),
        'reboot': () => executeCommand('reboot || systemctl reboot'),
    });
}

