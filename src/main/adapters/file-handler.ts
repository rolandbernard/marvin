
import { join } from 'path';

import { match, runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeCommand, escapeForTerminalLinux, escapeForCmdWindows, CommandMode } from 'main/adapters/commands';

export function getSocketPath(): string {
    return match(getPlatform(), {
        'linux': join('/tmp', 'marvin.sock'),
        'win32': join('\\\\?\\pipe', 'tmp', 'marvin.sock'),
        'unsupported': '',
    });
}

export function getDefaultPath(): string {
    return match(getPlatform(), {
        'linux': '/',
        'win32': 'C:\\',
        'unsupported': '',
    });
}

export function openFile(path: string) {
    return runMatch(getPlatform(), {
        'linux': () => openFileLinux(path),
        'win32': () => openFileWindows(path),
        'unsupported': () => { }
    });
}

function openFileLinux(path: string) {
    return executeCommand(`xdg-open ${escapeForTerminalLinux(path)}`);
}

function openFileWindows(path: string) {
    return executeCommand(`start "" ${escapeForCmdWindows(path)}`, CommandMode.SIMPLE, 'cmd');
}
