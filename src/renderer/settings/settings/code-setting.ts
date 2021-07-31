
import { css, customElement, html } from 'lit-element';

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

