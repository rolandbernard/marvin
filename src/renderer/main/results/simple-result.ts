
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { SimpleResult } from 'common/result';

@customElement('simple-result')
export class SimpleResultComponent extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    result?: SimpleResult;

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                background: var(--input-background-color);
                padding: 0.75rem;
            }
            .icon {
                flex: 0 0 auto;
                color: var(--output-accent-color);
            }
            .text {
                flex: 1 1 auto;
                display: flex;
                flex-flow: column;
                align-items: flex-start;
                justify-content: center;
                font-family: var(--font-family);
                font-weight: 400;
            }
            .primary {
                font-size: 1rem;
            }
            .secondary {
                font-size: 0.85rem;
            }
        `;
    }

    render() {
        return html`
            <icon-display
                class="icon"
                .icon="${this.result?.icon}"
                .fallback="${this.result?.primary[0]}"
            ></icon-display>
            <div class="text">
                <div class="primary">${this.result?.primary}</div>
                <div class="secondary">${this.result?.secondary}</div>
            </div>
        `;
    }
}

