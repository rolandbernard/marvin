
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { importAll, fakeTemplateArray } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

importAll(require.context('./settings', true, /\.ts$/));

@customElement('some-setting')
export class SomeSetting extends AbstractSetting {

    element(tag: string, ...attributes: any[]) {
        return html(fakeTemplateArray([
            `<${tag} .config="`,
            `" .desc="`,
            `" .index="`,
            `" @update="`,
            `"></${tag}>`,
        ]), ...attributes);
    }

    render() {
        return this.element(this.desc?.kind + '-setting', this.config, this.desc, this.index, this.onUpdate);
    }
}

