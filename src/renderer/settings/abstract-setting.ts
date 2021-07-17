
import { LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { ConfigDescription } from "common/config-desc";
import { DeepIndex, indexObject } from "common/util";

export class AbstractSetting extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ConfigDescription;

    @property({ attribute: false })
    index?: DeepIndex;

    validate(_value: string): string | undefined {
        return undefined;
    }

    isDisabled(): boolean {
        if(this.desc?.disabled) {
            return indexObject(this.config, this.desc.disabled.index) === this.desc.disabled.compare;
        } else {
            return false;
        }
    }

    configValue() {
        return indexObject(this.config, this.index);
    }

    onChange(e: CustomEvent) {
        if (this.config && this.index && this.validate(e.detail.value) === undefined) {
            const parent = indexObject(this.config, this.index.slice(0, this.index.length - 1));
            if (parent) {
                parent[this.index[this.index.length - 1]] = e.detail.value;
                this.dispatchEvent(new CustomEvent('update'));
            }
        }
    }
}

