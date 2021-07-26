
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeApplicationLinux, getAllApplicationsLinux, getDefaultDirectoriesLinux, updateApplicationCacheLinux } from 'main/adapters/applications/linux';

export interface Application {
    icon?: string;
    name?: Record<string, string>;
    action?: Record<string, string>;
    description?: Record<string, string>;
    other?: Record<string, string[]>;
    application: unknown;
    file: string;
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
        'linux': () => getAllApplicationsLinux(),
        'unsupported': async () => [],
    });
}

export function executeApplication(application: unknown) {
    return runMatch(getPlatform(), {
        'linux': () => executeApplicationLinux(application),
        'unsupported': () => {},
    });
}

