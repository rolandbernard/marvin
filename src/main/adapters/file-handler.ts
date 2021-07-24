
import { match, runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeCommand, escapeForTerminal } from 'main/adapters/commands';

export function getDefaultPath(): string {
    return match(getPlatform(), {
        'linux': '/',
        'unsupported': '',
    });
}

export function openFile(path: string) {
    return runMatch(getPlatform(), {
        'linux': () => openFileLinux(path),
        'unsupported': () => { }
    });
}

function openFileLinux(path: string) {
    return executeCommand(`xdg-open ${escapeForTerminal(path)}`);
}

