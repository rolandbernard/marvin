
import { customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';

@customElement('output-field')
export class OutputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    results?: Result[];

    render() {
        return html`
        `;
    }
}

