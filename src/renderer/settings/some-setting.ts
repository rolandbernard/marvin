
import { customElement, html } from 'lit-element';

import { AbstractSetting } from 'renderer//settings/abstract-setting';

import 'renderer/settings/settings/amount-setting';
import 'renderer/settings/settings/array-setting';
import 'renderer/settings/settings/boolean-setting';
import 'renderer/settings/settings/button-setting';
import 'renderer/settings/settings/code-setting';
import 'renderer/settings/settings/color-setting';
import 'renderer/settings/settings/object-setting';
import 'renderer/settings/settings/path-setting';
import 'renderer/settings/settings/quality-setting';
import 'renderer/settings/settings/result-setting';
import 'renderer/settings/settings/select-action-setting';
import 'renderer/settings/settings/select-setting';
import 'renderer/settings/settings/shortcut-setting';
import 'renderer/settings/settings/size-setting';
import 'renderer/settings/settings/text-setting';
import 'renderer/settings/settings/time-setting';

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

