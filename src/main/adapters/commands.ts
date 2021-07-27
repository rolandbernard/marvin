
import { promisify } from 'util';
import { exec } from 'child_process';

import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

const execAsync = promisify(exec);

export enum CommandMode {
    SIMPLE = 'simple',
    TERMINAL = 'terminal',
}

export function executeCommand(command: string, mode = CommandMode.SIMPLE) {
    return runMatch(getPlatform(), {
        'linux': () => executeCommandLinux(command, mode),
        'unsupported': () => { }
    });
}

export function escapeForTerminal(text: string) {
    return `'${text.replace(/\'/g, "'\\''")}'`;
}

function executeCommandLinux(command: string, mode = CommandMode.SIMPLE) {
    return runMatch(mode, {
        'terminal': () => execAsync(`xterm -e ${escapeForTerminal(command)}`).catch(() => {}),
        'simple': () => execAsync(command).catch(() => {}),
    });
}

