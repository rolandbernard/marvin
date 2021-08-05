
import { clipboard } from 'electron';
import * as mathjs from 'mathjs';
import algebrite from 'algebrite';

import { config as configDesc, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { getTranslation, Translatable } from 'common/local/locale';

import { module } from 'main/modules';
import { moduleConfig, config } from 'main/config';

const MODULE_ID = 'calculator';

class CalculatorConfig extends ModuleConfig {
    @configKind('quality')
    quality = 0.5;

    @configDesc({ kind: 'select', options: [ 'mathjs', 'algebrite', 'mathjs_algebrite' ] })
    backend = 'mathjs';

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class CalculatorModule implements Module<SimpleResult> {
    readonly configs = CalculatorConfig;

    get config() {
        return moduleConfig<CalculatorConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<SimpleResult[]> {
        if (query.text.length > 0) {
            const results: SimpleResult[] = [];
            const addResult = (supplier: () => string, name?: Translatable) => {
                try {
                    const value = supplier();
                    results.push({
                        module: MODULE_ID,
                        query: query.text,
                        kind: 'simple-result',
                        icon: { material: 'functions' },
                        primary: `= ${value}`,
                        secondary: `${query.text} ${name ? getTranslation(name, config) : ''}`,
                        autocomplete: `${query.raw} = ${value}`,
                        quality: this.config.quality,
                    });
                } catch (e) { }
            }
            if (this.config.backend.includes('mathjs')) {
                addResult(() => mathjs.evaluate(query.text).toString());
                addResult(() => mathjs.simplify(query.text).toString(), 'simplified');
                addResult(() => mathjs.rationalize(query.text).toString(), 'rationalized');
            }
            if (this.config.backend.includes('algebrite')) {
                addResult(() => algebrite.float(query.text).d?.toString() ?? '');
                addResult(() => algebrite.eval(query.text).toString());
                addResult(() => algebrite.simplify(query.text).toString(), 'simplified');
                addResult(() => algebrite.rationalize(query.text).toString(), 'rationalized');
            }
            return results.filter((val, index) =>
                !['', 'nil', 'null', 'undefined'].includes(val.primary.replace('=', '').trim())
                && val.primary.substr(2).replaceAll(' ', '').trim() !== query.text.replaceAll(' ', '').trim()
                && results.findIndex((v) => v.primary.replaceAll(' ', '').trim() === val.primary.replaceAll(' ', '').trim()) === index
            );
        } else {
            return [];
        }
    }

    async execute(result: SimpleResult) {
        clipboard.writeText(result.primary.substr(2));
    }
}

