
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { GlobalConfig } from 'common/config';
import { ConfigDescription } from 'common/config-desc';
import { DeepIndex, indexObject } from 'common/util';

export class AbstractSetting extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ConfigDescription;

    @property({ attribute: false })
    index?: DeepIndex;

    validate(_value: unknown): string | undefined {
        return undefined;
    }

    isDisabled(): boolean {
        if(this.desc?.disabled) {
            return indexObject(this.config, this.desc.disabled.index) === this.desc.disabled.compare;
        } else {
            return false;
        }
    }

    configValueFor<Type>(index?: DeepIndex): Type {
        return indexObject(this.config, index) as Type;
    }

    configValue<Type>(): Type {
        return this.configValueFor<Type>(this.index);
    }

    updateConfig(value: any) {
        if (this.config && this.index) {
            const parent = indexObject(this.config, this.index.slice(0, this.index.length - 1));
            if (parent) {
                parent[this.index[this.index.length - 1]] = value;
            }
        }
    }

    onUpdate() {
        this.dispatchEvent(new CustomEvent('update'));
    }

    onChange(e: CustomEvent) {
        if (this.validate(e.detail.value) === undefined) {
            this.updateConfig(e.detail.value);
            this.onUpdate();
        }
    }
}

