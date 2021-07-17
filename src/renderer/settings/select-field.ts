
import { css, customElement, html, LitElement, property } from "lit-element";
import { classMap } from "lit-html/directives/class-map";

@customElement('select-field')
export class SelectField extends LitElement {

    @property({ attribute: false })
    value?: string;

    @property({ attribute: false })
    options?: { value: string, label: string }[];

    @property({ attribute: false })
    disabled?: boolean;

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: (event.target as HTMLSelectElement).value,
            }
        }));
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
            .input-wrap {
                width: 100%;
                background: var(--settings-background);
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
            }
            .input-wrap.disabled {
                pointer-events: none;
            }
            .input-wrap.enabled:hover {
                border: 1px solid var(--settings-border-hover-color);
            }
            .input-wrap.enabled:focus-within {
                border-color: var(--settings-active-color);
                box-shadow: 0 0 0 1px var(--settings-active-color);
            }
            .input {
                width: 100%;
                padding: 0.75rem;
                font-family: var(--font-family);
                font-size: 1rem;
                background: none;
                border: none;
                outline: none;
                appearance: none;
            }
        `;
    }

    render() {
        const classes = classMap({
            'input-wrap': true,
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
        });
        return html`
            <div class="${classes}">
                <select
                    class="input"
                    ?disabled="${this.disabled}"
                    @change="${this.onChange}"
                >
                    ${this.options?.map(option => html`
                        <option
                            class="option"
                            value="${option.value}"
                            ?selected="${option.value === this.value}"
                        >
                            ${option.label}
                        </option>
                    `)}
                </select>
            </div>
        `;
    }
}
