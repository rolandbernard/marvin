
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { SimpleResult } from 'common/result';
import { Query } from 'common/query';

import 'renderer/common/icon-display';
import {highlightTextUsingMatch} from '../highliter';

@customElement('simple-result')
export class SimpleResultComponent extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    result?: SimpleResult;

    @property({ attribute: false })
    query?: Query;

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                background: var(--output-background);
                padding: 0.85rem;
                color: var(--output-text-color);
                user-select: none;
            }
            .icon {
                flex: 0 0 auto;
                color: var(--output-accent-color);
                margin-right: 0.75rem;
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
                font-size: 1.25rem;
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
                <div class="primary">
                    ${highlightTextUsingMatch(this.result?.primary, this.query)}
                </div>
                <div class="secondary">
                    ${highlightTextUsingMatch(this.result?.secondary, this.query)}
                </div>
            </div>
        `;
    }
}

