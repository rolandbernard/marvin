
import { ipcRenderer } from 'electron';
import { css, customElement, html } from 'lit-element';

import { ButtonConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-button';

@customElement('button-setting')
export class ButtonSetting extends AbstractSetting {
    desc?: ButtonConfig

    onClick() {
        if (this.desc?.confirm) {
            const question = getTranslation(this.desc.name!, this.config) + '?';
            if (confirm(question)) {
                ipcRenderer.send(this.desc.action);
            }
        } else if (this.desc) {
            ipcRenderer.send(this.desc.action);
        }
    }

    static get styles() {
        return css`
            .toggle {
                padding: 0 1rem;
            }
        `;
    }

    render() {
        return html`
            <text-button
                .text="${getTranslation(this.desc?.name!, this.config)}"
                @click="${this.onClick}"
            ></text-button>
        `;
    }
}

