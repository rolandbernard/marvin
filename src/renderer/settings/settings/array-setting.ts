
import { css, customElement, html, LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { ArrayConfig } from "common/config-desc";
import { DeepIndex } from "common/util";

@customElement('array-setting')
export class ArraySetting extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ArrayConfig;

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

