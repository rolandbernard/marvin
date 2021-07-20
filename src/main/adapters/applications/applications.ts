
import { Language } from 'common/local/locale';
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeApplicationLinux, getDefaultDirectoriesLinux, updateApplicationCacheLinux } from 'main/adapters/applications/linux';

export interface Application {
    icon?: string;
    name?: Record<Language, string>;
    action?: Record<Language, string>;
    description?: Record<Language, string>;
    other?: Record<Language, string[]>;
    application: string;
}

export function getDefaultDirectories(): string[] {
    return runMatch(getPlatform(), {
        'linux': () => getDefaultDirectoriesLinux(),
        'unsupported': () => [],
    });
}

export function updateApplicationCache(directories: string[]) {
    return runMatch(getPlatform(), {
        'linux': () => updateApplicationCacheLinux(directories),
        'unsupported': () => {},
    });
}

export function getAllApplications(): Promise<Application[]> {
    return runMatch(getPlatform(), {
        'linux': () => getAllApplications(),
        'unsupported': async () => [],
    });
}

export function executeApplication(application: string) {
    return runMatch(getPlatform(), {
        'linux': () => executeApplicationLinux(application),
        'unsupported': () => {},
    });
}

