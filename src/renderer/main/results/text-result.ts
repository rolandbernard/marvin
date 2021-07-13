
import { customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { TextResult } from 'common/result';

@customElement('text-result')
export class TextResultComponent extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    result?: TextResult;

    render() {
        return html`
        `;
    }
}

