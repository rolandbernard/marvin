
import { css, customElement, html, LitElement, property } from 'lit-element';

@customElement('text-button')
export class TextButton extends LitElement {

    @property({ attribute: false })
    text?: string;

    @property({ attribute: false })
    disabled?: boolean;

    static get styles() {
        return css`
        `;
    }

    render() {
        return html`
        `
    }
}

