
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

export function escapeForTerminalLinux(text: string) {
    return `'${text.replace(/\'/g, "'\\''")}'`;
}

function executeCommandLinux(command: string, mode = CommandMode.SIMPLE, shell?: string) {
    return runMatch(mode, {
        'terminal': () => execAsync(`xterm -e ${escapeForTerminalLinux(command)}`, { shell: shell }).catch(() => {}),
        'simple': () => execAsync(command, { shell: shell }).catch(() => {}),
    });
}

export function escapeForTerminalWindows(text: string) {
    return `"${text}"`;
}

function executeCommandWindows(command: string, mode = CommandMode.SIMPLE, shell?: string) {
    return runMatch(mode, {
        'terminal': () => execAsync(`start cmd /c "${command}"`, { shell: shell }).catch(() => {}),
        'simple': () => execAsync(command, { shell: shell }).catch((e) => {console.log(e)}),
    });
}
