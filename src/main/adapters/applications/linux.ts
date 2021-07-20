
import { app } from 'electron';
import { join } from 'path';

import { Application } from 'main/adapters/applications/applications';

export function getDefaultDirectoriesLinux(): string[] {
    return [
        '/usr/share/applications/',
        join(app.getPath('home'), '.local/share/applications/'),
    ];
}

export async function updateApplicationCacheLinux(directories: string[]) {
}

export async function getAllApplicationsLinux(): Promise<Application[]> {
    return [];
}

export function executeApplicationLinux(application: string) {
}

