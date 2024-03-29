
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';

@customElement('amount-setting')
export class AmountSetting extends AbstractSetting {

    validate(shortcut: string): string | undefined {
        return parseInt(shortcut) >= 0.0 ? undefined : getTranslation('size_error', this.config);
    }

    updateConfig(value: string) {
        super.updateConfig(parseInt(value));
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
        `;
    }

    render() {
        return html`
            <text-field
                type="number"
                .value="${this.configValue<number>().toString()}"
                .validation="${this.validate.bind(this)}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></text-field>
        `;
    }
}

