
import { css, customElement, html, LitElement, property } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import { GlobalConfig } from 'common/config';

import 'app/material-icon';

@customElement('input-field')
export class InputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property()
    text: string = '';

    static get styles() {
        return css`
            :host {
                height: 2.5rem;
                display: flex;
                flex-flow: row nowrap;
            }
            .icon {
                color: white;
            }
            .input {
                font-size: 1.5rem;
                font-weight: 300;
                appearance: none;
                border: none;
                outline: none;
            }
        `;
    }

    render() {
        const input = styleMap({
            background: this.config?.theme.background_color_input ?? '',
            color: this.config?.theme.text_color_input ?? '',
        });
        return html`
            <material-icon class="icon" name="search"></material-icon>
            <input class="input" style="${input}"></input>
        `;
    }
}

