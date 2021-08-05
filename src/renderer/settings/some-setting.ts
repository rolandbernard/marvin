
import { customElement, html } from 'lit-element';

import { importAll } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

importAll(require.context('./settings', true, /\.ts$/));

@customElement('some-setting')
export class SomeSetting extends AbstractSetting {

    element(tag: string, ...attributes: any[]) {
        return html([
            `<${tag} .config="`,
            `" .desc="`,
            `" .index="`,
            `" @update="`,
            `"></${tag}>`,
        ] as any, ...attributes);
    }

    render() {
        return this.element(this.desc?.kind + '-setting', this.config, this.desc, this.index, this.onUpdate);
    }
}

