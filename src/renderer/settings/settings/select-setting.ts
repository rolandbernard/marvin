
import { css, customElement, html } from 'lit-element';

import { SelectConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/select-field';

@customElement('select-setting')
export class SelectSetting extends AbstractSetting {
    desc?: SelectConfig;

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
        `;
    }

    render() {
        const options = this.desc?.options.map(option => ({
            value: option,
            label: getTranslation(option, this.config),
        }));
        return html`
            <select-field
                .value="${this.configValue()}"
                .options="${options}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></select-field>
        `;
    }
}

