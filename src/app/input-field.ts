
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
            .wrapper {
                padding: 0.75rem;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
            }
            .icon {
                flex: 0 0 auto;
                font-size: 2rem;
                margin-right: 0.5rem;
            }
            .input {
                font-family: var(--font-family);
                flex: 1 1 100%;
                font-size: 1.5rem;
                font-weight: 300;
                appearance: none;
                border: none;
                outline: none;
                background: none;
            }
        `;
    }

    render() {
        const icon = styleMap({
            color: this.config?.theme.accent_color_input ?? '',
        });
        const wrapper = styleMap({
            background: this.config?.theme.background_color_input ?? '',
        });
        const input = styleMap({
            color: this.config?.theme.text_color_input ?? '',
        });
        return html`
            <div class="wrapper" style="${wrapper}">
                <material-icon
                    class="icon"
                    name="search"
                    style="${icon}"
                ></material-icon>
                <input
                    class="input"
                    style="${input}"
                ></input>
            </div>
        `;
    }
}

