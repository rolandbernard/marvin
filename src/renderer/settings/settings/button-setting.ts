
import { ipcRenderer } from 'electron';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { ButtonConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';
import { IpcChannels } from 'common/ipc';
import { indexObject } from 'common/util';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-button';

@customElement('button-setting')
export class ButtonSetting extends AbstractSetting {
    desc?: ButtonConfig

    isLoading(): boolean {
        if(this.desc?.loading) {
            return indexObject(this.config, this.desc.loading.index) === this.desc.loading.compare;
        } else {
            return false;
        }
    }

    async onClick() {
        if (!this.isDisabled() && !this.isLoading()) {
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
                .disabled="${this.isDisabled() || this.isLoading()}"
                .loading="${this.isLoading()}"
                @click="${this.onClick}"
            ></text-button>
        `;
    }
}

