
import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { getTranslation } from 'common/local/locale';

import { module } from 'main/modules';
import { config, moduleConfig } from 'main/config';
import { openUrl } from 'main/adapters/url-handler';

const MODULE_ID = 'email';

interface EmailResult extends SimpleResult {
    module: typeof MODULE_ID;
    url: string;
}

class EmailConfig extends ModuleConfig {
    @configKind('quality')
    quality = 1;

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class EmailModule implements Module<EmailResult> {
    readonly configs = EmailConfig;

    get config() {
        return moduleConfig<EmailConfig>(MODULE_ID);
    }

    isValidEmail(str: string): boolean {
        const pattern = new RegExp('^(mailto:)?' +
            '[^@]+@' +
            '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}$', 'i');
        return pattern.test(str);
    }

    completeEmail(str: string): string {
        if (str.startsWith('mailto:')) {
            return str;
        } else {
            return 'mailto:' + str;
        }
    }

    async search(query: Query): Promise<EmailResult[]> {
        if (this.isValidEmail(query.text)) {
            const email = this.completeEmail(query.text);
            return [{
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: { material: 'drafts' },
                primary: query.text,
                secondary: getTranslation('open_new_email', config),
                quality: this.config.quality,
                url: email,
            }];
        } else {
            return [];
        }
    }

    async execute(result: EmailResult) {
        openUrl(result.url);
    }
}

