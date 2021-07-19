
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
                min-height: calc(100% - 2rem);
                padding: 0.25rem 1rem;
                box-sizing: border-box;
                user-select: none;
                overflow: hidden;
            }
            .description {
                font-family: var(--font-family);
                font-size: 1rem;
                margin: 1rem;
            }
        `;
    }

    render() {
        const desc = this.desc?.name + '_description';
        return html`
            <div class="page">
                ${hasTranslation(desc)
                    ? html`
                        <div class="description">
                            ${getTranslation(desc, this.config)}
                        </div>
                    `
                    : undefined}
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

