
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
        this.input?.focus();
        this.onScroll();
    }

    static get styles() {
        return css`
            .wrapper {
                padding: 0.85rem 0.75rem;
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
                font-variant-ligatures: none;
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
                user-select: none;
                position: absolute;
                display: inline;
                overflow: hidden;
                opacity: var(--prediction-opacity);
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
            .icon {
                width: 1.65rem;
                height: 1.65rem;
                margin-right: 0.65rem;
                fill: none;
                stroke: var(--input-accent-color);
                stroke-width: 6px;
                stroke-linecap: round;
                transform-origin: 50% 50%;
            }
            .loading .icon {
                animation: rotate 600ms infinite linear;
            }
            @keyframes rotate {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
            .path {
                transition: var(--transition);
                transition-property: d; 
            }
            .loading .path:nth-child(1) {
                d: path('M 47.5 10 A 37.5 37.5 0 0 1 85 47.5');
            }
            .loading .path:nth-child(2) {
                d: path('M 47.5 85 A 37.5 37.5 0 0 1 47.5 85');
            }
            .loading .path:nth-child(3) {
                d: path('M 47.5 85 A 37.5 37.5 0 0 1 10 47.5');
            }
            .loading .path:nth-child(4) {
                d: path('M 10 47.5 A 37.5 37.5 0 0 1 10 47.5');
            }
            .loading .path:nth-child(5) {
                d: path('M 85 47.5 L 85 47.5');
            }
        `;
    }

    render() {
        const prediction = this.prediction.startsWith(this.text)
            ? html`<div class="prediction">${this.prediction}</div>`
            : undefined;
        const classes = classMap({
            'loading': this.loading,
        });
        return html`
            <div class="wrapper ${classes}">
                <svg class="icon" viewBox="0 0 95 95">
                    <path class="path" d="M 35 10 A 25 25 0 0 1 60 35"/>
                    <path class="path" d="M 60 35 A 25 25 0 0 1 35 60"/>
                    <path class="path" d="M 35 60 A 25 25 0 0 1 10 35"/>
                    <path class="path" d="M 10 35 A 25 25 0 0 1 35 10"/>
                    <path class="path" d="M 53 53 L 85 85"/>
                </svg>
                <div class="field">
                    ${prediction}
                    <input
                        ?autofocus="${true}"
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

