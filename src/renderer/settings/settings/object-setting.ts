
import { css, customElement, html } from 'lit-element';

import { ObjectConfig } from 'common/config-desc';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

@customElement('object-setting')
export class ObjectSetting extends AbstractSetting {
    desc?: ObjectConfig;

    static get styles() {
        return css`
            .wrapper {
                border-radius: var(--settings-border-radius);
                background: var(--settings-background);
                border: 1px solid var(--settings-border-color);
                padding: 0.25rem 0.8rem;
            }
        `;
    }

    render() {
        return html`
            <div class="wrapper">
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

