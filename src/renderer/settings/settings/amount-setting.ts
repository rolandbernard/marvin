
import { css, customElement, html, LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { SimpleConfig } from "common/config-desc";
import { DeepIndex } from "common/util";

@customElement('amount-setting')
export class AmountSetting extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: SimpleConfig & { kind: 'amount' };

    @property({ attribute: false })
    index?: DeepIndex;

    static get styles() {
        return css`
        `;
    }

    render() {
        return html`
        `;
    }
}

