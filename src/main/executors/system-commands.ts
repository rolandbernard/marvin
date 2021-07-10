
import { exec } from 'child_process';
import { runMatch } from 'common/util';

export enum Command {
    SHUTDOWN = 'shutdown',
    REBOOT   = 'reboot',
}

export function getSystemCommands(): Command[] {
    return [ Command.SHUTDOWN, Command.REBOOT ];
}

export function executeSystemCommands(command: Command) {
    runMatch(command, {
        'shutdown': () => exec('shutdown now || systemctl poweroff'),
        'reboot': () => exec('reboot || systemctl reboot'),
    });
}

