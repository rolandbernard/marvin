
import { css, customElement, html } from 'lit-element';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

@customElement('info-setting')
export class InfoSetting extends AbstractSetting {

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
            .text {
                font-family: var(--font-family);
                color: var(--settings-text-color);
                font-size: 1rem;
                padding: 0.5rem 1rem;
            }
        `;
    }

    render() {
        return html`
            <div class="text">
                ${this.configValue<string>()}
            </div>
        `;
    }
}

