
import { customElement, html, css } from 'lit-element';
import { ipcRenderer } from 'electron';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';
import { copyCase } from 'common/util';

import { getConfigStyles } from 'renderer/common/theme';
import { QueryExecutor } from 'renderer/common/executor';

import 'renderer/common/output-list';
import 'renderer/styles/index.css';

import 'renderer/main/input-field';
import 'renderer/main/some-preview';

@customElement('page-root')
export class PageRoot extends QueryExecutor {

    constructor() {
        super();
        ipcRenderer.on('show', (_msg, config: GlobalConfig) => {
            this.config = config;
            ipcRenderer.send('query', this.query);
        });
        ipcRenderer.on('hide', () => {
            this.query = '';
            this.selected = 0;
            this.results = [];
        });
    }

    executeResult(result: Result) {
        ipcRenderer.send('execute', result);
        window.close();
    }

    onDrag(e: CustomEvent) {
        ipcRenderer.send('drag', e.detail.result);
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column;
                align-items: stretch;
                justify-content: flex-start;
            }
            .window {
                margin: 10px;
                max-height: calc(100% - 20px);
                display: flex;
                flex-direction: column;
                box-shadow: var(--box-shadow-position) var(--output-shadow-color);
                border-radius: var(--border-radius) var(--border-radius);
            }
            .input {
                flex: 0 0 auto;
                min-height: var(--min-element-height);
                box-shadow: var(--box-shadow-position) var(--input-shadow-color);
                border-radius: var(--border-radius) var(--border-radius) 0 0;
                overflow: hidden;
                z-index: 1;
            }
            .output-area {
                flex: 1 1 auto;
                position: relative;
                height: fit-content;
                border-radius: 0 0 var(--border-radius) var(--border-radius);
                overflow: hidden;
            }
            .output {
                width: 100%;
                max-height: 100%;
                overflow-y: overlay;
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
        return html`
            <div
                class="window"
                style="${getConfigStyles(this.config)}"
                @keydown="${this.onKeyDown}"
            >
                <input-field
                    class="input"
                    .text="${this.query}"
                    .prediction="${copyCase(this.selectedResult()?.autocomplete ?? '', this.query)}"
                    .loading=${this.loading}
                    .config="${this.config}"
                    @change="${this.onQueryChange}"
                ></input-field>
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
                                @drag="${this.onDrag}"
                            ></output-list>
                            <some-preview
                                .preview="${this.selectedResult()?.preview}"
                            ></some-preview>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

