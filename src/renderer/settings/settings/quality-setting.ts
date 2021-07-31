
import { css, customElement, html } from 'lit-element';

import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';

@customElement('quality-setting')
export class QualitySetting extends AbstractSetting {

    validate(shortcut: string): string | undefined {
        const value = parseFloat(shortcut);
        return value >= 0.0 && value <= 1.0 ? undefined : getTranslation('quality_error', this.config);
    }

    updateConfig(value: string) {
        super.updateConfig(parseFloat(value));
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

