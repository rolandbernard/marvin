
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FilePreview } from 'common/result';

@customElement('video-preview')
export class VideoPreview extends LitElement {

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
            <video
                class="preview"
                ?controls="${true}"
                ?autoplay="${true}"
                src="${this.preview?.file ?? ''}"
            ></video>
        `;
    }
}

