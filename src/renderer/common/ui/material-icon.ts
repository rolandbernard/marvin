
import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('material-icon')
export class MaterialIcon extends LitElement {

    @property()
    name: string = '';

    static get styles() {
        return css`
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .material-icons {
                font-family: 'Material Icons';
                font-weight: normal;
                font-style: normal;
                line-height: 1;
                text-transform: none;
                letter-spacing: normal;
                word-wrap: normal;
                white-space: nowrap;
                direction: ltr;
                text-rendering: optimizeLegibility;
                display: inline-block;
                user-select: none;
            }
        `;
    }

    render() {
        return html`
            <span class="material-icons">
                ${this.name}
            </span>
        `;
    }
}

