
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { getTranslation } from 'common/local/locale';
import { ArrayConfig } from 'common/config-desc';
import { cloneDeep } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/settings/some-setting';
import 'renderer/common/ui/material-icon';
import 'renderer/common/ui/button-like';

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
                const name = getTranslation(this.desc?.base?.name!, this.config);
                const large = desc.kind === 'object';
                const classes = classMap({
                    'large': large,
                });
                return html`
                    <tr class="row">
                        ${large ? undefined : html`<td class="name">${name}</td>`}
                        <td class="setting ${classes}" colspan="${large ? 2 : 1}">
                            <some-setting
                                .config="${this.config}"
                                .desc="${desc}"
                                .index="${entry_index}"
                                @update="${this.onUpdate}"
                            ></some-setting>
                        </td>
                        <td class="delete">
                            <button-like class="button-like">
                                <material-icon
                                    class="button"
                                    name="delete"
                                    @click="${() => this.onDelete(i)}"
                                ></material-icon>
                            </button-like>
                        </td>
                    </tr>
                    <tr class="row">
                        <td colspan="2">
                            <div class="divider"></div>
                        </td>
                    </tr>
                `;
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
                background: var(--settings-border-color);
                opacity: 0.25;
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
            .button-like {
                display: block;
                margin: 0.25rem;
                border-radius: 50%;
                overflow: hidden;
            }
            .button {
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                font-size: 1.5rem;
                color: var(--settings-accent-color);
                cursor: pointer;
                transition: var(--transition);
                transition-property: background, color; 
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
                        <td class="setting"></td>
                        <td class="add">
                            <button-like class="button-like">
                                <material-icon
                                    class="button"
                                    name="add"
                                    @click="${this.onNew}"
                                ></material-icon>
                            </button-like>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    }
}

