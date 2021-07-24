
import { css, customElement, html } from 'lit-element';

import { getTranslation, hasTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer//settings/abstract-setting';

import 'renderer/settings/settings-table';

@customElement('settings-page')
export class SettingsPage extends AbstractSetting {

    static get styles() {
        return css`
            :host {
                overflow: overlay;
            }
            :host::-webkit-scrollbar {
                width: var(--scrollbar-width);
                height: var(--scrollbar-width);
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
        return html`
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
                    .desc="${this.desc}"
                    .index="${this.index}"
                    @update="${this.onUpdate}"
                ></settings-table>
            </div>
        `;
    }
}

