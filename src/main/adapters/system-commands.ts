
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { CommandMode, executeCommand } from 'main/adapters/commands';

export enum Command {
    SHUTDOWN = 'shutdown',
    REBOOT   = 'reboot',
}

export function executeSystemCommands(command: Command) {
    return runMatch(getPlatform(), {
        'linux': () => executeSystemCommandsLinux(command),
        'win32': () => executeSystemCommandsWindows(command),
        'unsupported': () => { }
    });
}

function executeSystemCommandsLinux(command: Command) {
    return runMatch(command, {
        'shutdown': () => executeCommand('shutdown now || systemctl poweroff'),
        'reboot': () => executeCommand('reboot || systemctl reboot'),
    });
}

function executeSystemCommandsWindows(command: Command) {
    return runMatch(command, {
        'shutdown': () => executeCommand('shutdown /s /t 0', CommandMode.SIMPLE, 'cmd'),
        'reboot': () => executeCommand('shutdown /r /t 0', CommandMode.SIMPLE, 'cmd'),
    });
}
