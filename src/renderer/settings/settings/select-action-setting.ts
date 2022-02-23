
import { ipcRenderer } from 'electron';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { SelectActionConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/select-field';

@customElement('select-action-setting')
export class SelectActionSetting extends AbstractSetting {
    desc?: SelectActionConfig;

    onChange(e: CustomEvent) {
        if (this.desc) {
            ipcRenderer.send(this.desc.action, e.detail.value);
        }
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
        `;
    }

    render() {
        const options = this.desc?.options.map(option => ({
            value: option,
            label: getTranslation(option, this.config),
        }));
        return html`
            <select-field
                .placeholder="${getTranslation(this.desc!.placeholder, this.config)}"
                .options="${options}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></select-field>
        `;
    }
}

