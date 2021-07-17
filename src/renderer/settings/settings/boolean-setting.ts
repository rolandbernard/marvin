
import { css, customElement, html } from "lit-element";

import { AbstractSetting } from "renderer/settings/abstract-setting";

import 'renderer/settings/toggle-switch';

@customElement('boolean-setting')
export class BooleanSetting extends AbstractSetting {

    static get styles() {
        return css`
            :host {
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            .toggle {
                padding-right: 1rem;
            }
        `;
    }

    render() {
        return html`
            <toggle-switch
                class="toggle"
                .value=${this.configValue()}
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></toggle-switch>
        `;
    }
}
