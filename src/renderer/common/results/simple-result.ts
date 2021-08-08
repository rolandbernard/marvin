
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { SimpleResult } from 'common/result';
import { Query } from 'common/query';

import { highlightTextUsingMatch } from 'renderer/common/highlighter';

import 'renderer/common/icon-display';

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
                display: flex;
                flex-flow: column;
                align-items: flex-start;
                justify-content: center;
                font-family: var(--font-family);
            }
            .primary {
                font-size: 1.25rem;
                font-weight: 400;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-bottom: 0.125rem;
                width: 100%;
            }
            .primary strong {
                font-weight: 600;
            }
            .secondary {
                font-size: 0.75rem;
                font-weight: 300;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
            }
            .secondary strong {
                font-weight: 500;
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
                .fallback="${this.result?.primary[0] ?? ''}"
            ></icon-display>
            <div class="text">
                <div class="primary">
                    ${highlightTextUsingMatch(this.result?.primary, query)}
                </div>
                <div class="secondary">
                    ${highlightTextUsingMatch(this.result?.secondary, query)}
                </div>
            </div>
        `;
    }
}

