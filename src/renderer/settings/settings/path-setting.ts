
import { css, customElement, html } from 'lit-element';
import { isAbsolute } from 'path';

import { getTranslation } from 'common/local/locale';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';

@customElement('path-setting')
export class PathSetting extends AbstractSetting {

    validate(path: string): string | undefined {
        if (isAbsolute(path)) {
            return undefined;
        } else {
            return getTranslation('path_error', this.config);
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
        return html`
            <text-field
                .value="${this.configValue<string>()}"
                .validation="${this.validate.bind(this)}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></text-field>
        `;
    }
}

