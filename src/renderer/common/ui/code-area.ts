
import { css, customElement, html, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('code-area')
export class CodeArea extends LitElement {

    @property({ attribute: false })
    value?: string;

    @property({ attribute: false })
    disabled?: boolean;

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: (event.currentTarget as HTMLTextAreaElement).value,
            }
        }));
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Tab') {
            event.preventDefault();
            const target = (event.currentTarget as HTMLTextAreaElement);
            const selection_start = target.selectionStart;
            const selection_end = target.selectionEnd;
            const new_value = `${target.value.substring(0, selection_start)}    ${target.value.substring(selection_end)}`;
            target.value = new_value;
            target.selectionStart = selection_start + 4;
            target.selectionEnd = selection_start + 4;
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
                font-family: var(--font-family-mono);
                color: var(--settings-text-color);
                font-size: 1rem;
                background: none;
                border: none;
                outline: none;
                width: 100%;
                resize: vertical;
                white-space: pre;
            }
            .disabled .input {
                color: var(--settings-border-hover-color);
                user-select: none;
            }
            .input::-webkit-scrollbar {
                width: var(--scrollbar-width);
                height: var(--scrollbar-width);
            }
            .input::-webkit-scrollbar-track,
            .input::-webkit-scrollbar-track-piece,
            .input::-webkit-resizer,
            .input::-webkit-scrollbar-corner,
            .input::-webkit-scrollbar-button {
                display: none;
            }
            .input::-webkit-scrollbar-thumb {
                background: var(--settings-selection-background);
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
                <textarea
                    class="input"
                    spellcheck="false"
                    autocomplete="off"
                    ?disabled="${this.disabled}"
                    .value=${this.value}
                    @change="${this.onChange}"
                    @keydown="${this.onKeyDown}"
                ></textarea>
            </div>
        `;
    }
}

