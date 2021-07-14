
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';

import 'renderer/common/material-icon';

@customElement('input-field')
export class InputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    text: string = '';

    @property({ attribute: false })
    prediction: string = '';

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
            .field {
                flex: 1 1 100%;
                position: relative;
            }
            .input, .prediction {
                font-family: var(--font-family);
                font-size: 1.5rem;
                font-weight: 300;
                color: var(--input-text-color);
            }
            .input {
                width: 100%;
                appearance: none;
                border: none;
                outline: none;
                background: none;
                padding: 0;
                margin: 0;
            }
            .prediction {
                pointer-events: none;
                position: absolute;
                display: inline;
                opacity: var(--prediction-opacity);
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
        `;
    }

    render() {
        const prediction = this.prediction.startsWith(this.text)
            ? html`<div class="prediction">${this.prediction}</div>`
            : undefined;
        return html`
            <div class="wrapper">
                <material-icon
                    class="icon"
                    name="search"
                ></material-icon>
                <div class="field">
                    ${prediction}
                    <input
                        class="input"
                        spellcheck="false"
                        autocomplete="off"
                        .value="${this.text}"
                        @input="${this.onChange}"
                    ></input>
                </div>
            </div>
        `;
    }
}

