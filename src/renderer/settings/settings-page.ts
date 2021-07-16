
import { css, customElement, html, LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { ObjectConfig } from "common/config-desc";
import { DeepIndex } from "common/util";
import { getTranslation } from "common/local/locale";

import 'renderer/settings/some-setting';

@customElement('settings-page')
export class SettingsPage extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    page?: ObjectConfig;

    @property({ attribute: false })
    index?: DeepIndex;

    static get styles() {
        return css`
            :host {
                overflow-y: overlay;
            }
            :host::-webkit-scrollbar {
                width: var(--scrollbar-width);
            }
            :host::-webkit-scrollbar-track,
            :host::-webkit-scrollbar-track-piece,
            :host::-webkit-resizer,
            :host::-webkit-scrollbar-corner,
            :host::-webkit-scrollbar-button {
                display: none;
            }
            :host::-webkit-scrollbar-thumb {
                background: var(--settings-accent-color);
            }
            .page {
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                border-radius: var(--settings-border-radius);
                background: var(--settings-background);
                margin: 1rem;
                width: calc(100% - 2rem);
                min-height: calc(100% - 2rem);
                padding: 0 1rem;
            }
            .table {
                width: 100%;
            }
            .row {
                font-family: var(--font-family);
            }
            .name {
                padding: 0.8rem 0;
                text-align: left;
                white-space: nowrap;
            }
            .setting {
                width: 100%;
                text-align: right;
            }
        `;
    }

    render() {
        return html`
            <div class="page">
                <table class="table">
                    ${this.page?.options?.map(option => html`
                        <tr class="row">
                            <td class="name">${getTranslation(option.name!, this.config)}</td>
                            <td class="setting">
                                <some-setting
                                    .config="${this.config}"
                                    .desc="${option}"
                                    .index="${this.index?.concat(option.name!)}"
                                ></some-setting>
                            </td>
                        </tr>
                    `)}
                </table>
            </div>
        `;
    }
}

