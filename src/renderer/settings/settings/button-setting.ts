
import { ipcRenderer } from 'electron';
import { customElement, html } from 'lit-element';

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

    render() {
        return html`
            <text-button
                .text="${getTranslation(this.desc?.name!, this.config)}"
                .disabled="${this.isDisabled()}"
                @click="${this.onClick}"
            ></text-button>
        `;
    }
}

