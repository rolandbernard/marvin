
import { css, customElement, html, LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { SimpleConfig } from "common/config-desc";
import { DeepIndex, indexObject } from "common/util";

import 'renderer/settings/text-field';

@customElement('shortcut-setting')
export class ShortcutSetting extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: SimpleConfig & { kind: 'boolean' };

    @property({ attribute: false })
    index?: DeepIndex;

    validateShortcut() {
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
        `;
    }

    render() {
        return html`
            <text-field
                .value="${indexObject(this.config, this.index)}"
            ></text-field>
        `;
    }
}

