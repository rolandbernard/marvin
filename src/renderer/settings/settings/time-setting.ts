
import { css, customElement, html, property } from 'lit-element';

import { getTranslation } from 'common/local/locale';
import { closestUnit, shortUnit, time, TimeUnit } from 'common/time';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';
import 'renderer/common/ui/select-field';

@customElement('time-setting')
export class TimeSetting extends AbstractSetting {

    @property({ attribute: false })
    unit?: TimeUnit;

    @property({ attribute: false })
    value: string = '';

    validate(shortcut: string): string | undefined {
        return parseFloat(shortcut) >= 0.0 ? undefined : getTranslation('time_error', this.config);
    }

    updateConfig(value: string) {
        const milliseconds = time(parseFloat(value), this.unit ?? TimeUnit.MILLISECONDS);
        super.updateConfig(milliseconds);
    }

    onUnitChange(e: CustomEvent) {
        this.unit = e.detail.value as TimeUnit;
        this.value = (this.configValue<number>() / time(1, this.unit)).toString();
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
            .select {
                margin: -1px;
                width: 4.5rem;
            }
        `;
    }

    render() {
        if (!this.unit) {
            this.unit = closestUnit(this.configValue());
        }
        const value = time(parseFloat(this.value), this.unit);
        if (this.configValue() !== value) {
            this.unit = closestUnit(this.configValue());
            this.value = (this.configValue<number>() / time(1, this.unit)).toString();
        }
        const options = Object.values(TimeUnit).slice(0, 3).map(option => ({
            value: option,
            label: shortUnit(option),
        }));
        return html`
            <text-field
                type="number"
                .value="${this.value}"
                .validation="${this.validate.bind(this)}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            >
                <select-field
                    class="select"
                    .value=${this.unit}
                    .options=${options}
                    .disabled="${this.isDisabled()}"
                    @change="${this.onUnitChange}"
                ></select-field>
            </text-field>
        `;
    }
}

