
import { runMatch } from 'common/util';
import { getPlatform } from 'common/platform';

import { executeApplicationLinux, getAllApplicationsLinux, getDefaultDirectoriesLinux, updateApplicationCacheLinux } from 'main/adapters/applications/linux';
import { executeApplicationWindows, getAllApplicationsWindows, getDefaultDirectoriesWindows, updateApplicationCacheWindows } from 'main/adapters/applications/windows';

let id_to_app: Record<string, Application> = {};

export interface Application {
    icon?: string;
    name?: Record<string, string>;
    action?: Record<string, string>;
    description?: Record<string, string>;
    other?: Record<string, string[]>;
    application: unknown;
    file: string;
    id: string;
}

export function getDefaultDirectories(): string[] {
    return runMatch(getPlatform(), {
        'linux': () => getDefaultDirectoriesLinux(),
        'win32': () => getDefaultDirectoriesWindows(),
        'unsupported': () => [],
    });
}

export function getApplication(id: string): Application | undefined {
    return id_to_app[id];
}

export async function updateApplicationCache(directories: string[]) {
    await runMatch(getPlatform(), {
        'linux': () => updateApplicationCacheLinux(directories),
        'win32': () => updateApplicationCacheWindows(directories),
        'unsupported': () => {},
    });
    for (const app of await getAllApplications()) {
        id_to_app[app.id] = app;
    }
}

export function getAllApplications(): Promise<Application[]> {
    return runMatch(getPlatform(), {
        'linux': () => getAllApplicationsLinux(),
        'win32': () => getAllApplicationsWindows(),
        'unsupported': async () => [],
    });
}

export function executeApplication(application: unknown) {
    return runMatch(getPlatform(), {
        'linux': () => executeApplicationLinux(application),
        'win32': () => executeApplicationWindows(application),
        'unsupported': () => {},
    });
}

