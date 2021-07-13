
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeCommand } from 'main/adapters/commands';

export enum Command {
    SHUTDOWN = 'shutdown',
    REBOOT   = 'reboot',
}

export function executeSystemCommands(command: Command) {
    runMatch(getPlatform(), {
        'linux': () => executeSystemCommandsLinux(command),
        'unsupported': () => { }
    });
}

export function executeSystemCommandsLinux(command: Command) {
    runMatch(command, {
        'shutdown': () => executeCommand('shutdown now || systemctl poweroff'),
        'reboot': () => executeCommand('reboot || systemctl reboot'),
    });
}

