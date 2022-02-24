
import { ipcRenderer } from 'electron';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ButtonConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';
import { IpcChannels } from 'common/ipc';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-button';

@customElement('button-setting')
export class ButtonSetting extends AbstractSetting {
    desc?: ButtonConfig

    async onClick() {
        if (!this.isDisabled()) {
            if (this.desc?.confirm) {
                const question = getTranslation(this.desc.name!, this.config) + '?';
                if (await ipcRenderer.invoke(IpcChannels.SHOW_DIALOG, question)) {
                    ipcRenderer.send(this.desc.action);
                }
            } else if (this.desc) {
                ipcRenderer.send(this.desc.action);
            }
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

