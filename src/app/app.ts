
import { ipcRenderer } from 'electron';
import { customElement, html, css, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';

import 'app/input-field';
import 'app/output-list';

import 'index.css';

@customElement('page-root')
export class PageRoot extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

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

    constructor() {
        super();
        ipcRenderer.on('show', (_msg, config: GlobalConfig) => {
            this.config = config;
        });
    }

    render() {
        return html`
            <div class="window">
                <input-field class="input" .config="${this.config}"></input-field>
                <div class="output">
                    <output-list .config="${this.config}"></output-list>
                </div>
            <div>
        `;
    }
}

