
import { customElement, html, css } from 'lit-element';
import { ipcRenderer } from 'electron';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';

import { getConfigStyles } from 'renderer/common/theme';
import { QueryExecutor } from 'renderer/common/executor';

import 'renderer/common/output-list';
import 'renderer/main/input-field';
import 'renderer/styles/index.css';

@customElement('page-root')
export class PageRoot extends QueryExecutor {

    constructor() {
        super();
        ipcRenderer.on('show', (_msg, config: GlobalConfig) => {
            this.config = config;
        });
        ipcRenderer.on('hide', () => {
            this.query = '';
            ipcRenderer.send('query', '');
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
                align-items: center;
                justify-content: center;
            }
            .window {
                width: calc(100% - 20px);
                height: calc(100% - 20px);
                display: flex;
                flex-direction: column;
            }
            .input {
                flex: 0 0 auto;
                min-height: var(--min-element-height);
                box-shadow: var(--box-shadow-position) var(--input-shadow-color);
            }
            .output-list {
                box-shadow: var(--box-shadow-position) var(--output-shadow-color);
            }
            .output {
                flex: 1 1 auto;
                overflow-y: overlay;
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
                background: var(--output-accent-color);
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
                    .prediction="${this.selectedResult()?.autocomplete ?? ''}"
                    .config="${this.config}"
                    @change="${this.onQueryChange}"
                ></input-field>
                <div class="output">
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
                </div>
            <div>
        `;
    }
}
