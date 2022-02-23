
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

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
                .color="${this.configValue<string>()}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></color-button>
        `;
    }
}

