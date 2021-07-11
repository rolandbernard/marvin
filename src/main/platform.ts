
import { platform } from 'os';

import { isInEnum } from 'common/util';

export function isDevelopment() {
    return process.env.NODE_ENV !== 'production';
}

// List of supported platforms
export enum Platform {
    LINUX = 'linux',
    UNSUPPORTED = 'unsupported',
}

export function getPlatform(): Platform {
    const pf = platform();
    if (isInEnum(Platform, pf)) {
        return pf;
    } else {
        return Platform.UNSUPPORTED;
    }
}

