
import { css, customElement, html, LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { ObjectConfig } from "common/config-desc";

@customElement('settings-page')
export class SettingsPage extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ObjectConfig;

    static get styles() {
        return css`
        `;
    }

    render() {
        return html`
            <div class="page">
            <div>
        `;
    }
}

