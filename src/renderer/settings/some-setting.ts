
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { importAll, fakeTemplateArray } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

importAll(require.context('./settings', true, /\.ts$/));

const template_cache: Record<string, TemplateStringsArray | undefined> = {};

@customElement('some-setting')
export class SomeSetting extends AbstractSetting {

    element(tag: string, ...attributes: any[]) {
        let template = template_cache[tag];
        if (!template) {
            template = fakeTemplateArray([
                `<${tag} .config="`,
                `" .desc="`,
                `" .index="`,
                `" @update="`,
                `"></${tag}>`,
            ]);
            template_cache[tag] = template;
        }
        return html(template, ...attributes);
    }

    render() {
        return this.element(this.desc?.kind + '-setting', this.config, this.desc, this.index, this.onUpdate);
    }
}

