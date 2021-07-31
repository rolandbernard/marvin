
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { openFile } from 'main/adapters/file-handler';

export function openUrl(url: string) {
    return runMatch(getPlatform(), {
        'linux': () => openFile(url),
        'win32': () => openFile(url),
        'unsupported': () => { }
    });
}

