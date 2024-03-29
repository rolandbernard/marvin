
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';

@customElement('text-setting')
export class TextSetting extends AbstractSetting {

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
                .value="${this.configValue<string>()}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></text-field>
        `;
    }
}

