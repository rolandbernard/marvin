
import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import 'renderer/common/ui/button-like';

@customElement('text-button')
export class TextButton extends LitElement {

    @property({ attribute: false })
    text?: string;

    @property({ attribute: false })
    disabled?: boolean;

    static get styles() {
        return css`
            .button {
                background: var(--settings-background);
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
                transition: var(--transition);
                transition-property: border; 
                color: var(--settings-text-color);
                user-select: none;
                appearance: none;
                padding: 0;
                margin: 0;
                outline: none;
                width: 15rem;
                min-width: min-content;
                max-width: 100%;
            }
            .button.enabled:hover {
                border: 1px solid var(--settings-border-hover-color);
                cursor: pointer;
            }
            .button.disabled {
                color: var(--settings-border-hover-color);
                pointer-events: none;
            }
            .text {
                text-transform: uppercase;
                padding: 0.75rem;
                font-family: var(--font-family);
                font-size: 0.9rem;
                font-weight: 500;
            }
        `;
    }

    render() {
        const classes = classMap({
            'button': true,
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
        });
        return html`
            <button class="${classes}">
                <button-like
                    .disabled=${this.disabled}
                >
                    <div class="text">${this.text}</div>
                </button-like>
            </button>
        `
    }
}

