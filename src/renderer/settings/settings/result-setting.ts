
import { css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Result } from 'common/result';

import { QueryExecutor } from 'renderer/common/executor';

import { AbstractSetting } from 'renderer/settings/abstract-setting';

import 'renderer/common/ui/text-field';
import 'renderer/common/output-list';

@customElement('result-selector')
export class ResultSelector extends QueryExecutor {
    @property({ attribute: false })
    result?: Result;

    @property({ attribute: false })
    disabled?: boolean;

    @property({ attribute: false })
    focused = false;

    onQueryResult(results: Result[], finished: boolean) {
        if (this.focused) {
            super.onQueryResult(results, finished);
        }
    }

    executeResult(result: Result) {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: result,
            }
        }));
        this.query = '';
        this.results = [];
    }

    onFocus() {
        this.focused = true;
        this.results = [];
        this.sendQueryRequest();
    }

    onBlur() {
        this.focused = false;
        this.results = [];
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
                display: flex;
                flex-flow: column;
            }
            .input {
                flex: 1 1 100%;
            }
            .output-area {
                flex: 0 0 0;
                position: relative;
                height: 0;
            }
            .output {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-height: 20rem;
                overflow-y: overlay;
                border-radius: 0 0 var(--border-radius) var(--border-radius);
                z-index: 100;
            }
            .result {
                display: flex;
                flex-flow: row nowrap;
                align-items: stretch;
                border-radius: 0 0 var(--border-radius) var(--border-radius);
                overflow: hidden;
                width: 100%;
            }
            .output-list {
                box-shadow: var(--box-shadow-position) var(--output-shadow-color);
                flex: 1 1 100%;
                width: 100%;
            }
            .output::-webkit-scrollbar {
                width: var(--scrollbar-width);
            }
            .output::-webkit-scrollbar-track,
            .output::-webkit-scrollbar-track-piece,
            .output::-webkit-resizer,
            .output::-webkit-scrollbar-corner,
            .output::-webkit-scrollbar-button {
                display: none;
            }
            .output::-webkit-scrollbar-thumb {
                background: var(--output-selection-background);
            }
        `;
    }

    render() {
        let placeholder = '';
        if (this.result?.kind === 'text-result') {
            placeholder = this.result.text;
        } else if (this.result?.kind === 'simple-result') {
            placeholder = this.result.primary;
            if (this.result.secondary) {
                placeholder = `${placeholder} - ${this.result.secondary}`;
            }
        }
        return html`
            <text-field
                class="input"
                .placeholder="${placeholder}"
                .value="${this.query}"
                .disabled="${this.disabled}"
                @input-change="${this.onQueryChange}"
                @keydown="${this.onKeyDown}"
                @blur="${this.onBlur}"
                @focus="${this.onFocus}"
            ></text-field>
            <div class="output-area">
                <div class="output">
                    <div class="result">
                        <output-list
                            class="output-list"
                            .config="${this.config}"
                            .results="${this.results}"
                            .selected="${this.selected}"
                            .centered="${this.centered}"
                            .query="${this.query}"
                            @hover="${this.onHover}"
                            @execute="${this.onExecute}"
                        ></output-list>
                    </div>
                </div>
            </div>
        `;
    }
}

@customElement('result-setting')
export class ResultSetting extends AbstractSetting {

    static get styles() {
        return css`
            :host {
                width: 100%;
            }
        `;
    }

    render() {
        return html`
            <result-selector
                .config=${this.config}
                .result="${this.configValue<Result>()}"
                .disabled="${this.isDisabled()}"
                @change="${this.onChange}"
            ></result-selector>
        `;
    }
}

