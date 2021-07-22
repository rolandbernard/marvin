
import { css, customElement, html, LitElement, property, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import { GlobalConfig } from 'common/config';

import 'renderer/common/ui/material-icon';

@customElement('input-field')
export class InputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    text: string = '';

    @property({ attribute: false })
    prediction: string = '';

    @property({ attribute: false })
    loading = false;;

    @query('.input')
    input?: HTMLInputElement;

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: (event.target as HTMLInputElement).value,
            }
        }));
    }

    onScroll() {
        if (this.input && this.input.scrollLeft !== 0) {
            this.prediction = '';
        }
    }

    updated() {
        this.onScroll();
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
                white-space: pre;
                pointer-events: none;
                position: absolute;
                display: inline;
                opacity: var(--prediction-opacity);
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
            .icon {
                width: 1.75rem;
                height: 1.75rem;
                margin-right: 0.5rem;
                stroke: var(--input-accent-color);
                stroke-width: 4px;
            }
            .path {
                transform-origin: 50% 50%;
            }
            .loading .path {
                d: path('m 46.524486,55.970966 c -1.295659,0.75925 -5.263007,3.53983 -12.659024,3.592809 C 21.559597,59.651924 13.691653,52.660271 9.9262039,42.563167 v 0 0 0 0 0');
                animation: rotate 500ms infinite linear;
            }
            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `;
    }

    render() {
        const prediction = this.prediction.startsWith(this.text)
            ? html`<div class="prediction">${this.prediction}</div>`
            : undefined;
        const classes = classMap({
            'wrapper': true,
            'loading': this.loading,
        });
        return html`
            <div class="${classes}">
                <svg class="icon" viewBox="0 0 67.733 67.733">
                    <path
                        class="path"
                        d="m 37.473819,37.124262 c 0,0 -4.033383,4.734457 -12.172532,4.945909 -9.280568,0.241104 -16.8096247,-7.525925 -16.8096247,-16.809625 0,-9.2837 7.5259247,-16.8096253 16.8096247,-16.8096255 9.2837,8e-7 16.809627,7.5259255 16.809624,16.8096255 v 0 c 0.150704,7.379854 -4.637092,11.863716 -4.637092,11.863716 l 20.293728,20.978063"
                    />
                </svg>
                <div class="field">
                    ${prediction}
                    <input
                        class="input"
                        spellcheck="false"
                        autocomplete="off"
                        .value="${this.text}"
                        @input="${this.onChange}"
                        @scroll="${this.onScroll}"
                    ></input>
                </div>
            </div>
        `;
    }
}

