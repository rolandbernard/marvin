
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeCommand } from 'main/adapters/commands';

export interface Window {
    title: string;
    application: string;
    icon?: string;
    window: unknown;
}

export function openWindows(): Promise<Window[]> {
    return runMatch(getPlatform(), {
        'linux': () => openWindowsLinux(),
        'win32': async () => [],
        'unsupported': async () => []
    });
}

async function openWindowsLinux(): Promise<Window[]> {
    const result = await executeCommand('wmctrl -x -l');
    return result?.stdout?.split('\n').filter(line => line)
        .map(line => line.split(' ').map((elm) => elm.trim()).filter((elm) => elm.length >= 1))
        .map(line => ({
            title: line.slice(4).join(' '),
            application: line[2],
            window: line[0],
        })) ?? [];
}

export function focusWindow(window: unknown) {
    return runMatch(getPlatform(), {
        'linux': () => focusWindowLinux(window),
        'win32': () => { },
        'unsupported': () => { }
    });
}

function focusWindowLinux(window: unknown) {
    const id = window as string;
    return executeCommand(`wmctrl -i -a ${id}`);
}

