
import { promisify } from 'util';
import { exec } from 'child_process';

import { runMatch } from 'common/util';

const execAsync = promisify(exec);

enum CommandMode {
    SIMPLE = 'simple',
    SHELL = 'shell',
    TERMINAL = 'terminal',
}

export function executeCommand(command: string, mode = CommandMode.SIMPLE) {
    return runMatch(mode, {
        'terminal': () => execAsync(`xterm -e '${command.replace(/\'/g, "'\\''")}'`),
        'shell': () => execAsync(`sh <<< '${command.replace(/\'/g, "'\\''")}'`),
        'simple': () => execAsync(command),
    });
}

