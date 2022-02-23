
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FilePreview } from 'common/result';

@customElement('embed-preview')
export class EmbedPreview extends LitElement {

    @property({ attribute: false })
    preview?: FilePreview;

    static get styles() {
        return css`
            .preview {
                max-width: 50%;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
            }
        `;
    }

    render() {
        return html`
            <embed
                class="preview"
                src="${this.preview?.file ?? ''}"
            ></embed>
        `;
    }
}
