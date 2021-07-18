
import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('text-field')
export class TextField extends LitElement {

    @property()
    type: string = 'text';

    @property({ attribute: false })
    value?: string;

    @property({ attribute: false })
    disabled?: boolean;

    @property({ attribute: false })
    validation?: (value: string) => string | undefined;

    @property({ attribute: false })
    error?: string;

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: (event.target as HTMLInputElement).value,
            }
        }));
    }

    onInput(event: Event) {
        this.error = this.validation?.((event.target as HTMLInputElement).value);
    }

    updated(props: Map<string, unknown>) {
        if (props.has('value')) {
            this.error = this.validation?.(this.value!);
        }
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-flow: column;
            }
            .input-wrap {
                display: flex;
                flex-flex: row nowrap;
                background: var(--settings-background);
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
                position: relative;
                transition: var(--transition);
                transition-property: border, box-shadow; 
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
            .input-wrap.enabled.wrong {
                border-color: var(--settings-error-color);
                box-shadow: 0 0 0 1px var(--settings-error-color);
            }
            .input {
                flex: 1 1 auto;
                padding: 0.75rem;
                font-family: var(--font-family);
                color: var(--settings-text-color);
                font-size: 1rem;
                background: none;
                border: none;
                outline: none;
                width: 100%;
            }
            .disabled .input {
                color: var(--settings-border-hover-color);
                user-select: none;
            }
            .slot {
                flex: 0 0 auto;
            }
            .error {
                position: absolute;
                font-size: 0.65rem;
                font-family: var(--font-family);
                color: var(--settings-error-color);
                padding-left: 0.5rem;
                text-align: left;
                bottom: -1.1rem;
                left: 0;
            }
        `;
    }

    render() {
        const classes = classMap({
            'input-wrap': true,
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
            'wrong': this.error ? true : false,
        });
        return html`
            <div class="${classes}">
                <input
                    class="input"
                    spellcheck="false"
                    autocomplete="off"
                    ?disabled="${this.disabled}"
                    type="${this.type}"
                    .value=${this.value}
                    @change="${this.onChange}"
                    @input="${this.onInput}"
                ></input>
                <slot class="slot"></slot>
                <div class="error">
                    ${this.error}
                </div>
            </div>
        `;
    }
}

