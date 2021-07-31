
import { clipboard } from 'electron';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { colorAsHex, colorAsHsl, colorAsHsv, colorAsRgb, isValidColor, parseColor } from 'common/color';

import { module } from 'main/modules';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'color';

class ColorConfig extends ModuleConfig {
    @configKind('quality')
    quality = 1;

    @configKind('boolean')
    color_preview = true;

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class UrlModule implements Module<SimpleResult> {
    readonly configs = ColorConfig;

    get config() {
        return moduleConfig<ColorConfig>(MODULE_ID);
    }

    async search(query: Query): Promise<SimpleResult[]> {
        if (isValidColor(query.text)) {
            const color = parseColor(query.text);
            const transformers = [
                colorAsHex,
                colorAsHsl,
                colorAsHsv,
                colorAsRgb,
            ];
            return transformers.map(func => ({
                module: MODULE_ID,
                query: query.text,
                kind: 'simple-result',
                icon: { material: 'palette' },
                primary: func(color),
                quality: this.config.quality,
                preview: this.config.color_preview ? {
                    kind: 'color-preview',
                    color: colorAsHex(color),
                } : undefined,
            }));
        } else {
            return [];
        }
    }

    async rebuild(_query: Query, result: SimpleResult): Promise<SimpleResult | undefined> {
        return {
            ...result,
            quality: this.config.quality,
            preview: this.config.color_preview ? {
                kind: 'color-preview',
                color: colorAsHex(parseColor(result.query)),
            } : undefined,
        };
    }

    async execute(result: SimpleResult) {
        clipboard.writeText(result.primary);
    }
}

