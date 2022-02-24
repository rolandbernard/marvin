
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FilePreview } from 'common/result';

@customElement('image-preview')
export class ImagePreview extends LitElement {

    @property({ attribute: false })
    preview?: FilePreview;

    static get styles() {
        return css`
            .preview {
                max-width: 50%;
                max-height: 100%;
                position: absolute;
                right: 0;
                top: 0;
            }
        `;
    }

    render() {
        return html`
            <img
                class="preview"
                src="${this.preview?.file ?? ''}"
            ></img>
        `;
    }
}

