
import { css, customElement, html, LitElement, property } from "lit-element";
import { classMap } from "lit-html/directives/class-map";

import 'renderer/common/material-icon';

@customElement('select-field')
export class SelectField extends LitElement {

    @property({ attribute: false })
    value?: string;

    @property({ attribute: false })
    options?: { value: string, label: string }[];

    @property({ attribute: false })
    disabled?: boolean;

    @property({ attribute: false })
    open = false;

    onOpen() {
        this.open = true;
        setTimeout(() => {
            // Only at after this event was handled
            const handle = () => {
                window.removeEventListener('click', handle);
                this.onClose();
            }
            window.addEventListener('click', handle);
        });
    }

    onClose(value?: string) {
        this.open = false;
        if (value) {
            this.value = value;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: value,
                }
            }));
        }
    }

    static get styles() {
        return css`
            .select {
                font-family: var(--font-family);
                color: var(--settings-text-color);
                font-size: 1rem;
                position: relative;
                text-align: left;
                user-select: none;
            }
            .value {
                padding: 0.75rem;
                background: var(--settings-background);
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
                position: relative;
                color: var(--settings-text-color);
            }
            .disabled .value, .open .value {
                pointer-events: none;
            }
            .enabled:hover .value {
                border: 1px solid var(--settings-border-hover-color);
            }
            .enabled:focus-within .value {
                border-color: var(--settings-active-color);
                box-shadow: 0 0 0 1px var(--settings-active-color);
            }
            .dropdown {
                top: 0;
                position: absolute;
                width: 100%;
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                border-radius: var(--settings-input-border-radius);
                background: var(--settings-background);
                z-index: 100;
                transition: var(--transition);
                transition-property: opacity, visibility;
                opacity: 0;
                visibility: hidden;
                outline: none;
            }
            .open .dropdown {
                opacity: 1;
                visibility: visible;
            }
            .option {
                padding: 0.75rem;
                color: var(--settings-text-color);
                transition: var(--transition);
                transition-property: background, color; 
            }
            .option:hover {
                background: var(--settings-hover-background);
            }
            .icon {
                content: 'expand_more';
                position: absolute;
                right: 0.1rem;
                top: 50%;
                transform: translate(0, -50%);
                font-size: 1rem;
                pointer-events: none;
            }
        `;
    }

    render() {
        const classes = classMap({
            'select': true,
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
            'open': this.open,
        });
        return html`
            <div class="${classes}">
                <div
                    class="value"
                    @click="${this.onOpen}"
                >
                    ${this.options?.find(option => option.value === this.value)?.label}
                </div>
                <div class="dropdown">
                    ${this.options?.map(option => html`
                        <div
                            class="option"
                            @click="${() => this.onClose(option.value)}"
                        >
                            ${option.label}
                        </div>
                    `)}
                </div>
                <material-icon
                    class="icon"
                    name="expand_more"
                ></material-icon>
            </div>
        `;
    }
}
