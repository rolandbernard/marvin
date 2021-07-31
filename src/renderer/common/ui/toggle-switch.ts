
import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('toggle-switch')
export class ToggleSwitch extends LitElement {

    @property({ attribute: false })
    value?: boolean;

    @property({ attribute: false })
    disabled?: boolean;

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: (event.currentTarget as HTMLInputElement).checked,
            }
        }));
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .input {
                appearance: none;
                background: var(--settings-border-color);
                width: 2rem;
                height: 0.9rem;
                border-radius: 50rem;
                position: relative;
                outline: none;
                transition: var(--transition);
                transition-property: background;
            }
            .input.enabled {
                cursor: pointer;
            }
            .input.disabled {
                filter: saturate(0.25);
            }
            .input::before, .input::after {
                content: '';
                width: 1.25rem;
                height: 1.25rem;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 15%;
                transform: translate(-50%, -50%);
                transition: var(--transition);
                transition-property: background, left, width, height;
            }
            .input.enabled:hover::after, .input-enabled:hover::before {
                width: 1.4rem;
                height: 1.4rem;
            }
            .input::before {
                background: var(--settings-background);
                z-index: 5;
            }
            .input::after {
                background: var(--settings-border-hover-color);
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                z-index: 10;
            }
            .input:checked {
                background: var(--settings-light-active-color);
            }
            .input:checked::before {
                left: 85%;
            }
            .input:checked::after {
                left: 85%;
                background: var(--settings-active-color);
            }
        `;
    }

    render() {
        const classes = classMap({
            'input': true,
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
        });
        return html`
            <input
                type="checkbox"
                class="${classes}"
                ?disabled="${this.disabled}"
                .checked="${this.value ?? false}"
                @change="${this.onChange}"
            ></input>
        `;
    }
}

