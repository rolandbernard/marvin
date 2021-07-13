
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';

import 'renderer/common/material-icon';

@customElement('input-field')
export class InputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    text: string = '';

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: (event.target as HTMLInputElement).value,
            }
        }));
    }

    static get styles() {
        return css`
            .wrapper {
                padding: 0.85rem;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                background: var(--input-background);
            }
            .icon {
                flex: 0 0 auto;
                font-size: 1.75rem;
                margin-right: 0.5rem;
                color: var(--input-accent-color);
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
                padding: 0;
                margin: 0;
                color: var(--input-text-color);
            }
        `;
    }

    render() {
        return html`
            <div class="wrapper">
                <material-icon
                    class="icon"
                    name="search"
                ></material-icon>
                <input
                    class="input"
                    value="${this.text}"
                    @input="${this.onChange}"
                ></input>
            </div>
        `;
    }
}

