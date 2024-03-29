
import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { GlobalConfig } from 'common/config';
import { TextResult } from 'common/result';
import { Query } from 'common/query';

import { highlightTextUsingMatch } from 'renderer/common/highlighter';

@customElement('text-result')
export class TextResultComponent extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    result?: TextResult;

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: stretch;
                user-select: none;
                padding: 0.5rem;
            }
            .icon {
                flex: 0 0 auto;
                color: var(--output-accent-color);
                margin-right: 0.5rem;
            }
            .text {
                flex: 1 1 auto;
                min-width: 0;
                font-family: var(--font-family);
            }
        `;
    }

    render() {
        const text = this.result?.query ?? '';
        const query = new Query(text, text, true);
        return html`
            <icon-display
                class="icon"
                .icon="${this.result?.icon}"
                .fallback="${this.result?.text[0] ?? ''}"
            ></icon-display>
            <div class="text">
                ${highlightTextUsingMatch(this.result?.text, query)}
            </div>
        `;
    }
}

