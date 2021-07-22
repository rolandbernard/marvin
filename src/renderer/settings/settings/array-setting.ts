
import { css, customElement, html } from 'lit-element';

import { getTranslation } from 'common/local/locale';
import { ArrayConfig } from 'common/config-desc';
import { cloneDeep } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/settings/some-setting';
import 'renderer/common/ui/material-icon';

@customElement('array-setting')
export class ArraySetting extends AbstractSetting {
    desc?: ArrayConfig;

    onDelete(i: number) {
        this.configValue<unknown[]>()?.splice(i, 1);
        this.onUpdate();
    }

    onNew() {
        this.configValue<unknown[]>()?.push(cloneDeep(this.desc?.default));
        this.onUpdate();
    }

    buildItemRows() {
        const desc = this.desc?.base;
        if (desc && this.index && this.config) {
            return this.configValue<unknown[]>()?.map((_, i) => {
                const entry_index = this.index?.concat(i);
                if (desc.kind === 'object') {
                    return html`
                        <tr class="row">
                            <td class="setting large" colspan="2">
                                <some-setting
                                    .config="${this.config}"
                                    .desc="${desc}"
                                    .index="${entry_index}"
                                    @update="${this.onUpdate}"
                                ></some-setting>
                            </td>
                            <td class="delete">
                                <material-icon
                                    class="button"
                                    name="delete"
                                    @click="${() => this.onDelete(i)}"
                                ></material-icon>
                            </td>
                        </tr>
                        <tr class="row">
                            <td colspan="2">
                                <div class="divider"></div>
                            </td>
                        </tr>
                    `;
                } else {
                    const name = getTranslation(this.desc?.base?.name!, this.config);
                    return html`
                        <tr class="row">
                            <td class="name">${name}</td>
                            <td class="setting">
                                <some-setting
                                    .config="${this.config}"
                                    .desc="${desc}"
                                    .index="${entry_index}"
                                    @update="${this.onUpdate}"
                                ></some-setting>
                            </td>
                            <td class="delete">
                                <material-icon
                                    class="button"
                                    name="delete"
                                    @click="${() => this.onDelete(i)}"
                                ></material-icon>
                            </td>
                        </tr>
                        <tr class="row">
                            <td colspan="2">
                                <div class="divider"></div>
                            </td>
                        </tr>
                    `;
                }
            });
        }
    }

    static get styles() {
        return css`
            .page {
                border-radius: var(--settings-border-radius);
                background: var(--settings-background);
                border: 1px solid var(--settings-border-color);
                margin-top: -1rem;
                width: 100%;
                box-sizing: border-box;
                user-select: none;
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
                background: var(--settings-inactive-color);
            }
            .name {
                padding: 0.8rem;
                text-align: left;
                white-space: nowrap;
            }
            .setting {
                width: 100%;
                text-align: right;
                padding: 0.75rem 0;
            }
            .large {
                padding-left: 0.8rem;
            }
            .button {
                margin: 0.25rem;
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                font-size: 1.5rem;
                background: var(--settings-background);
                color: var(--settings-accent-color);
                cursor: pointer;
                transition: var(--transition);
                transition-property: background, color; 
            }
            .button:hover {
                background: var(--settings-hover-background);
            }
        `;
    }

    render() {
        return html`
            <div class="page">
                <table class="table">
                    ${this.buildItemRows()}
                    <tr class="row">
                        <td></td>
                        <td></td>
                        <td class="add">
                            <material-icon
                                class="button"
                                name="add"
                                @click="${this.onNew}"
                            ></material-icon>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    }
}

