
import { css, customElement, html } from "lit-element";

import { getTranslation } from "common/local/locale";

import { AbstractSetting } from "renderer/settings/abstract-setting";

import 'renderer/settings/text-field';

@customElement('shortcut-setting')
export class ShortcutSetting extends AbstractSetting {

    validate(shortcut: string): string | undefined {
        const match = shortcut.match(new RegExp(
            '^((Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)[+])*' +
            '([A-Za-z0-9!"#$%&\'()*+,\\-./:;<=>?@\\[\\]\\\\^_`{|}~]|F[0-9]|F1[0-9]|F2[0-4]|num[0-9]|numdec|numadd|numsub|nummult|numdiv' +
            'Plus|Space|Tab|Capslock|Numlock|Scrolllock|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp' +
            'PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)' +
            '([+](Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super))*$', 'i'
        ));
        return match ? undefined : getTranslation('shortcut_error', this.config);
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
                .value="${this.configValue()}"
                .validation="${this.validate.bind(this)}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></text-field>
        `;
    }
}

