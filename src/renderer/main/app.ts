
import { ipcRenderer } from 'electron';
import { customElement, html, css, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';

import { getConfigStyles } from 'renderer/common/theme';

import 'renderer/main/input-field';
import 'renderer/main/output-list';

import 'renderer/common/index.css';

@customElement('page-root')
export class PageRoot extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    query: string = '';

    @property({ attribute: false })
    results: Result[] = [];

    constructor() {
        super();
        ipcRenderer.on('show', (_msg, config: GlobalConfig) => {
            this.config = config;
        });
        ipcRenderer.on('query-result', (_msg, results: Result[]) => {
            this.results = results;
        });
    }

    onQueryChange(e: CustomEvent) {
        this.query = e.detail.value;
        ipcRenderer.send('query', this.query);
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
            }
            .output {
                flex: 1 1 auto;
            }
        `;
    }

    render() {
        return html`
            <div class="window" style="${getConfigStyles(this.config)}">
                <input-field
                    class="input"
                    .text="${this.query}"
                    .config="${this.config}"
                    @change="${this.onQueryChange}"
                ></input-field>
                <div class="output">
                    <output-list .config="${this.config}"></output-list>
                </div>
            <div>
        `;
    }
}

