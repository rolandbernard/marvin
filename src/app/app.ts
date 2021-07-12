
import { ipcRenderer } from 'electron';
import { customElement, html, css, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';

import 'app/input-field';
import 'app/output-list';

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
                <output-list class="output" .config="${this.config}"></output-list>
            <div>
        `;
    }
}

