
import { css, customElement, html } from 'lit-element';

import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';

@customElement('size-setting')
export class SizeSetting extends AbstractSetting {

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
            .unit {
                margin: -1px;
                width: 4.4rem;
                font-family: var(--font-family);
                font-size: 1rem;
                color: var(--settings-text-color);
                border-left: 1px solid var(--settings-border-color);
                border-radius: var(--settings-input-border-radius);
                padding: 0.75rem;
                box-sizing: border-box;
                text-align: left;
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
            >
                <div class="unit">px</div>
            </text-field>
        `;
    }
}

