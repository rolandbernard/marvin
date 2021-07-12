
import { customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';

@customElement('input-field')
export class InputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property()
    text: string = '';

    render() {
        return html`
            <div class="wrapper">
                <div class="icon"></div>
                <input class="input"></input>
            </div>
        `;
    }
}

