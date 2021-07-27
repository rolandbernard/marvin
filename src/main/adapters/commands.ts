
import { promisify } from 'util';
import { exec } from 'child_process';

import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

const execAsync = promisify(exec);

export enum CommandMode {
    SIMPLE = 'simple',
    TERMINAL = 'terminal',
}

export function executeCommand(command: string, mode = CommandMode.SIMPLE, shell?: string) {
    return runMatch(getPlatform(), {
        'linux': () => executeCommandLinux(command, mode, shell),
        'win32': () => executeCommandWindows(command, mode, shell),
        'unsupported': () => { }
    });
}

export function escapeForTerminal(text: string) {
    return `'${text.replace(/\'/g, "'\\''")}'`;
}

export function escapeCommandWindows(text: string) {
    return `${text.trim().replace(/(\r?\n)+/g, " & ")}`;
}

function executeCommandLinux(command: string, mode = CommandMode.SIMPLE, shell?: string) {
    return runMatch(mode, {
        'terminal': () => execAsync(`xterm -e ${escapeForTerminal(command)}`, { shell: shell }).catch(() => {}),
        'simple': () => execAsync(command, { shell: shell }).catch(() => {}),
    });
}

function executeCommandWindows(command: string, mode = CommandMode.SIMPLE, shell?: string) {
    return runMatch(mode, {
        'terminal': () => execAsync(`start cmd /c "${escapeCommandWindows(command)}"`, { shell: shell }).catch(() => {}),
        'simple': () => execAsync(escapeCommandWindows(command), { shell: shell }).catch(() => {}),
    });
}
