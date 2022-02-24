
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FilePreview } from 'common/result';

@customElement('audio-preview')
export class AudioPreview extends LitElement {

    @property({ attribute: false })
    preview?: FilePreview;

    static get styles() {
        return css`
            .preview {
                max-width: 30%;
                position: absolute;
                right: 0;
                top: 0;
            }
        `;
    }

    render() {
        return html`
            <audio
                class="preview"
                ?controls="${true}"
                ?autoplay="${true}"
                src="${this.preview?.file ?? ''}"
            ></audio>
        `;
    }
}
