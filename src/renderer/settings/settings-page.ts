
import { css, customElement, html, property } from 'lit-element';

import { getTranslation, hasTranslation } from 'common/local/locale';
import { ObjectConfig, ConfigDescription } from 'common/config-desc';
import { Query } from 'common/query';
import { DeepIndex } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/settings/settings-table';

@customElement('settings-page')
export class SettingsPage extends AbstractSetting {
    desc?: ObjectConfig;

    @property({ attribute: false })
    search: string = '';

    visible: number = 0;

    shouldIncludeObject(query: Query, desc: ConfigDescription, index: DeepIndex): boolean {
        if (hasTranslation(desc.name, this.config) && query.matchText(getTranslation(desc.name, this.config)) > 0.5) {
            return true;
        } else if (
            (desc.kind === 'object' || desc.kind === 'page' || desc.kind === 'pages')
            && desc.options?.some(d => this.shouldIncludeObject(query, d, [...index, d.name ?? '']))
        ) {
            return true;
        } else if (query.matchText(JSON.stringify(this.configValueFor<any>(index)) ?? '') > 0.5) {
            return true;
        } else if (query.matchText(JSON.stringify(desc) ?? '') > 0.5) {
            return true;
        } else {
            return false;
        }
    }

    filteredDescription(): ObjectConfig | undefined {
        const query = new Query(this.search, this.search, this.config?.general.enhanced_search ?? true);
        if (this.desc) {
            if (
                this.search.length === 0
                || (
                    hasTranslation(this.desc.name, this.config)
                    && query.matchText(getTranslation(this.desc.name, this.config)) > 0
                )
            ) {
                return this.desc;
            } else {
                return {
                    ...this.desc,
                    options: this.desc.options?.filter(
                        desc => this.shouldIncludeObject(query, desc, [...(this.index ?? []), desc.name ?? ''])
                    ),
                };
            }
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
            }
            .wrapper {
                padding-top: 2rem;
            }
            .page {
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                border-radius: var(--settings-border-radius);
                background: var(--settings-background);
                margin: 1rem;
                width: fit-content;
                min-width: calc(100% - 2rem);
                padding: 0.25rem 1rem;
                box-sizing: border-box;
                user-select: none;
            }
            .header {
                margin: 1rem 2rem;
            }
            .name {
                font-family: var(--font-family);
                font-size: 1.5rem;
                font-weight: 500;
            }
            .description {
                font-family: var(--font-family);
                font-size: 1rem;
                margin-top: 0.5rem;
            }
        `;
    }

    render() {
        const name = this.desc?.name ?? '';
        const desc = this.desc?.name + '_description';
        const filtered = this.filteredDescription();
        if (filtered?.options?.length !== 0) {
            return html`
                <div class="wrapper">
                    <div class="header">
                        ${hasTranslation(name)
                            ? html`
                                <div class="name">
                                    ${getTranslation(name, this.config)}
                                </div>
                            `
                            : undefined}
                        ${hasTranslation(desc)
                            ? html`
                                <div class="description">
                                    ${getTranslation(desc, this.config)}
                                </div>
                            `
                            : undefined}
                    </div>
                    <div class="page">
                        <settings-table
                            .config="${this.config}"
                            .desc="${filtered}"
                            .index="${this.index}"
                            @update="${this.onUpdate}"
                        ></settings-table>
                    </div>
                </div>
            `;
        }
    }
}

