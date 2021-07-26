
import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';

import 'renderer/common/ui/material-icon';
import 'renderer/common/ui/button-like';

@customElement('select-field')
export class SelectField<Type> extends LitElement {

    @property({ attribute: false })
    value?: Type;

    @property({ attribute: false })
    placeholder = ' ';

    @property({ attribute: false })
    options?: { value: Type, label: string }[];

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

    onClose(value?: Type) {
        this.open = false;
        if (value) {
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
                color: var(--settings-text-color);
            }
            .select.enabled {
                cursor: pointer;
            }
            .disabled, .placeholder {
                color: var(--settings-border-hover-color);
            }
            .value {
                padding: 0.75rem;
                background: var(--settings-background);
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
                position: relative;
                transition: var(--transition);
                transition-property: border, box-shadow; 
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
                top: calc(-2.5rem * var(--position));
                position: absolute;
                width: 100%;
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                border-radius: var(--settings-input-border-radius);
                background: var(--settings-background);
                z-index: 100;
                transition: var(--transition);
                transition-property: opacity, visibility, top;
                opacity: 0;
                visibility: hidden;
                outline: none;
            }
            .open .dropdown {
                opacity: 1;
                visibility: visible;
            }
            .option {
                display: block;
                font-size: 1rem;
                color: var(--settings-text-color);
            }
            .option-label {
                padding: 0.75rem;
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
        const styles = styleMap({
            '--position': (this.options?.findIndex(option => option.value === this.value) ?? 0).toString(),
        });
        return html`
            <div class="${classes}" style="${styles}">
                ${!this.value
                    ? html`
                        <div
                            class="value placeholder"
                            tabindex="0"
                            @click="${this.onOpen}"
                        >
                            ${this.placeholder}
                        </div>
                    `
                    : html`
                        <div
                            class="value"
                            tabindex="0"
                            @click="${this.onOpen}"
                        >
                            ${this.options?.find(option => option.value === this.value)?.label}
                        </div>
                    `
                }
                <div class="dropdown">
                    ${this.options?.map(option => html`
                        <button-like
                            class="option"
                            @click="${() => this.onClose(option.value)}"
                        >
                            <div class="option-label">
                                ${option.label}
                            <div>
                        </button-like>
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
