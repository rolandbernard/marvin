
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/toggle-switch';

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
                padding: 0.5rem 1rem;
            }
        `;
    }

    render() {
        return html`
            <toggle-switch
                class="toggle"
                .value="${this.configValue<boolean>()}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></toggle-switch>
        `;
    }
}
