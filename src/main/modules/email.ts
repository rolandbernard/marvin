
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
    quality = 0.9;

    constructor() {
        super(true);
    }
}

const MAIL_PATTERN = /^mailto:.*$|^[^@]+@(\w|-)+(\.(\w|-)+)*\.[a-z]{2,}$/iu;

@module(MODULE_ID)
export class EmailModule implements Module<EmailResult> {
    readonly configs = EmailConfig;

    get config() {
        return moduleConfig<EmailConfig>(MODULE_ID);
    }

    isValidEmail(str: string): boolean {
        return MAIL_PATTERN.test(str);
    }

    completeEmail(str: string): string {
        if (str.startsWith('mailto:')) {
            return str;
        } else {
            return 'mailto:' + str;
        }
    }

    itemForEmail(query: Query, url: string): EmailResult {
        const email = this.completeEmail(url);
        return {
            module: MODULE_ID,
            query: query.text,
            kind: 'simple-result',
            icon: { material: 'drafts' },
            primary: url,
            secondary: getTranslation('open_new_email', config),
            quality: this.config.quality,
            url: email,
        };
    }

    async search(query: Query): Promise<EmailResult[]> {
        if (this.isValidEmail(query.text)) {
            return [this.itemForEmail(query, query.text)];
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: EmailResult): Promise<EmailResult | undefined> {
        return this.itemForEmail(query, result.primary);
    }

    async execute(result: EmailResult) {
        openUrl(result.url);
    }
}

