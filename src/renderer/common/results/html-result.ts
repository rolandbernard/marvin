
import { customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { HtmlResult } from 'common/result';

@customElement('html-result')
export class HtmlResultComponent extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    result?: HtmlResult;

    render() {
        return html`
        `;
    }
}

