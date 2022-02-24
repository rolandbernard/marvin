
import { TemplateResult, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { DeepIndex } from 'common/util';
import { getTranslation } from 'common/local/locale';
import { ObjectConfig } from 'common/config-desc';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/settings/some-setting';

type TemplateArray = (TemplateResult | undefined)[] | undefined;

@customElement('settings-table')
export class SettingsTable extends AbstractSetting {
    desc?: ObjectConfig;

    subdivide(array: TemplateArray): TemplateArray {
        const result: TemplateArray = [];
        if (array) {
            for (let i = 0; i < array.length; i++) {
                if (i !== 0) {
                    result.push(html`
                        <tr class="row">
                            <td colspan="2">
                                <div class="divider"></div>
                            </td>
                        </tr>
                    `);
                }
                result.push(array[i]);
            }
        }
        return result;
    }

    buildSettingsRows() {
        const findSettings = (desc: ObjectConfig, index: DeepIndex): TemplateArray => {
            return desc.options?.map(entry => {
                const entry_index = index.concat(entry.name!);
                const name = getTranslation(entry.name!, this.config);
                if (entry.kind === 'object') {
                    return html`
                        <tr class="row">
                            <td>
                                <div class="subheader">${name}</div>
                            </td>
                        </tr>
                        ${this.subdivide(findSettings(entry, entry_index))}
                    `;
                } else if (entry.kind === 'array') {
                    return html`
                        <tr class="row">
                            <td class="name" colspan="2">${name}</td>
                        </tr>
                        <tr class="row">
                            <td class="setting" colspan="2">
                                <some-setting
                                    .config="${this.config}"
                                    .desc="${entry}"
                                    .index="${entry_index}"
                                    @update="${this.onUpdate}"
                                ></some-setting>
                            </td>
                        </tr>
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
        if (this.desc && this.index) {
            return this.subdivide(findSettings(this.desc, this.index));
        }
    }

    static get styles() {
        return css`
            :host {
                display: contents;
            }
            .table {
                width: 100%;
            }
            .row {
                font-family: var(--font-family);
            }
            .divider {
                height: 1px;
                margin: 0 0.5rem;
                background: var(--settings-border-color);
                opacity: 0.25;
            }
            .name {
                width: 30%;
                padding: 0.8rem 0;
                padding-right: 0.8rem;
                text-align: left;
                white-space: nowrap;
            }
            .setting {
                width: 70%;
                text-align: right;
                padding: 0.75rem 0;
            }
            .subheader {
                direction: ltr;
                font-size: 0.75rem;
                margin-left: -0.25rem;
                padding-top: 1rem;
                opacity: 0.75;
                font-weight: 600;
            }
        `;
    }

    render() {
        return html`
            <table class="table">
                ${this.buildSettingsRows()}
            </table>
        `;
    }
}

