
import { css, customElement, html, LitElement, property, TemplateResult } from "lit-element";

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

    onUpdate() {
        this.dispatchEvent(new CustomEvent('update'));
    }

    buildSettingsRows() {
        const findSettings = 
            (desc: ObjectConfig, index: DeepIndex):
            (TemplateResult | undefined)[] | undefined => {
            return desc.options?.map(entry => {
                const entry_index = index.concat(entry.name!);
                const name = getTranslation(entry.name!, this.config);
                if (entry.kind === 'object') {
                    return html`
                        <tr>
                            <td><div class="subheader">${name}</div></td>
                        </tr>
                        ${findSettings(entry, entry_index)}
                    `;
                } else {
                    return html`
                        <tr class="row">
                            <td class="name">${name}</td>
                            <td class="setting">
                                <some-setting
                                    .config="${this.config}"
                                    .desc="${entry}"
                                    .index="${entry_index}"
                                    @update="${this.onUpdate}"
                                ></some-setting>
                            </td>
                        </tr>
                    `;
                }
            });
        }
        if (this.page && this.index) {
            return findSettings(this.page, this.index);
        }
    }

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
                padding: 0.25rem 1rem;
                box-sizing: border-box;
                user-select: none;
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
                padding: 0.75rem 0;
            }
            .subheader {
                direction: ltr;
                font-size: 0.75rem;
                margin-left: -0.5rem;
                padding-top: 1rem;
                opacity: 0.75;
                font-weight: 600;
            }
        `;
    }

    render() {
        return html`
            <div class="page">
                <table class="table">
                    ${this.buildSettingsRows()}
                </table>
            </div>
        `;
    }
}

