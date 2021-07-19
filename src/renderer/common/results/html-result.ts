
import { css, customElement, html, LitElement, property } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import { GlobalConfig } from 'common/config';
import { HtmlResult } from 'common/result';

@customElement('html-result')
export class HtmlResultComponent extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    result?: HtmlResult;

    static get styles() {
        return css`
            .text {
                font-size: 1rem;
                font-family: var(--font-family);
                margin: auto;
            }
        `;
    }

    render() {
        return html`
            <div class="text">
                ${unsafeHTML(this.result?.html)}
            </div>
        `;
    }
}

