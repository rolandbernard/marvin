
import { css, customElement, html, LitElement, property } from 'lit-element';

import { FilePreview } from 'common/result';

@customElement('color-preview')
export class ColorPreview extends LitElement {

    @property({ attribute: false })
    preview?: FilePreview;

    static get styles() {
        return css`
        `;
    }

    render() {
        // TODO: Implement when necessary
        return html`
        `;
    }
}

