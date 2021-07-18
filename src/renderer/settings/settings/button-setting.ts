
import { customElement, html } from 'lit-element';

import { ButtonConfig } from 'common/config-desc';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

@customElement('button-setting')
export class ButtonSetting extends AbstractSetting {
    desc?: ButtonConfig

    render() {
        return html`
            
        `;
    }
}

