
import { css, customElement, html, LitElement, property } from "lit-element";

import { GlobalConfig } from "common/config";
import { SimpleConfig } from "common/config-desc";
import { DeepIndex, match } from "common/util";

import 'renderer/settings/settings/amount-setting';
import 'renderer/settings/settings/array-setting';
import 'renderer/settings/settings/boolean-setting';
import 'renderer/settings/settings/button-setting';
import 'renderer/settings/settings/code-setting';
import 'renderer/settings/settings/color-setting';
import 'renderer/settings/settings/object-setting';
import 'renderer/settings/settings/path-setting';
import 'renderer/settings/settings/quality-setting';
import 'renderer/settings/settings/result-setting';
import 'renderer/settings/settings/select-setting';
import 'renderer/settings/settings/shortcut-setting';
import 'renderer/settings/settings/size-setting';
import 'renderer/settings/settings/text-setting';
import 'renderer/settings/settings/time-setting';

@customElement('some-setting')
export class SomeSetting extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: SimpleConfig & { kind: 'amount' };

    @property({ attribute: false })
    index?: DeepIndex;

    static get styles() {
        return css`
        `;
    }

    render() {
        return html`
            ${this.desc && match(this.desc.kind, {
                'boolean': html`<boolean-setting .config={this.config} .desc=${this.desc} .index=${this.index}></boolean-setting>`,
                'quality': html`<quality-setting .config={this.config} .desc=${this.desc} .index=${this.index}></quality-setting>`,
                'path': html`<path-setting .config={this.config} .desc=${this.desc} .index=${this.index}></path-setting>`,
                'shortcut': html`<shortcut-setting .config={this.config} .desc=${this.desc} .index=${this.index}></shortcut-setting>`,
                'color': html`<color-setting .config={this.config} .desc=${this.desc} .index=${this.index}></color-setting>`,
                'code': html`<code-setting .config={this.config} .desc=${this.desc} .index=${this.index}></code-setting>`,
                'result': html`<result-setting .config={this.config} .desc=${this.desc} .index=${this.index}></result-setting>`,
                'size': html`<size-setting .config={this.config} .desc=${this.desc} .index=${this.index}></size-setting>`,
                'text': html`<text-setting .config={this.config} .desc=${this.desc} .index=${this.index}></text-setting>`,
                'time': html`<time-setting .config={this.config} .desc=${this.desc} .index=${this.index}></time-setting>`,
                'amount': html`<amount-setting .config={this.config} .desc=${this.desc} .index=${this.index}></amount-setting>`,
                'array': html`<array-setting .config={this.config} .desc=${this.desc} .index=${this.index}></array-setting>`,
                'select': html`<select-setting .config={this.config} .desc=${this.desc} .index=${this.index}></select-setting>`,
                'button': html`<button-setting .config={this.config} .desc=${this.desc} .index=${this.index}></button-setting>`,
                'object': html`<object-setting .config={this.config} .desc=${this.desc} .index=${this.index}></object-setting>`,
                'page': undefined,
                'pages': undefined,
            })}
        `;
    }
}

