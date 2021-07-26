
import { css, customElement, html } from 'lit-element';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/color-button';

@customElement('color-setting')
export class ColorSetting extends AbstractSetting {

    static get styles() {
        return css`
        `;
    }

    render() {
        return html`
            <color-button
                class="color"
                .color="${this.configValue()}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></color-button>
        `;
    }
}

