
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeCommand, escapeForTerminal } from 'main/adapters/commands';

export function openFile(path: string) {
    runMatch(getPlatform(), {
        'linux': () => openFileLinux(path),
        'unsupported': () => { }
    });
}

function openFileLinux(path: string) {
    executeCommand(`xdg-open ${escapeForTerminal(path)}`)
}

