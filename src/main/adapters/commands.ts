
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
        'terminal': () => execAsync(`xterm -e ${escapeForTerminalLinux(command)}`).catch(() => {}),
        'simple': () => execAsync(command, { shell: shell }).catch(() => {}),
    });
}

export function escapeForCmdWindows(text: string) {
    return `"${text}"`;
}

export function escapeForPowershellWindows(text: string) {
    return `"${text.replace(/([$`])/g, '`$1').replace(/"/g, '\\`"')}"`;
}

function executeCommandWindows(command: string, mode = CommandMode.SIMPLE, shell = 'powershell') {
    return runMatch(mode, {
        'terminal': async () => {
            if (shell === 'powershell') {
                return await execAsync(`Start-Process powershell ${escapeForPowershellWindows(command)}`, { shell: 'powershell' }).catch(() => {});
            } else {
                return await execAsync(`start cmd /c "${command}"`).catch(() => {});
            }
        },
        'simple': () => execAsync(command, { shell: shell }).catch(() => {}),
    });
}

