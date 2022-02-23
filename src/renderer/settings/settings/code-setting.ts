
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { AbstractSetting } from 'renderer//settings/abstract-setting';

import 'renderer/common/ui/code-area';

@customElement('code-setting')
export class CodeSetting extends AbstractSetting {

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
        `;
    }

    render() {
        return html`
            <code-area
                .value="${this.configValue<string>()}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></code-area>
        `;
    }
}

