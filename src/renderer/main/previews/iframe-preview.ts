
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { IFramePreview } from 'common/result';

@customElement('iframe-preview')
export class IFramePreviewComponent extends LitElement {

    @property({ attribute: false })
    preview?: IFramePreview;

    static get styles() {
        return css`
            .preview {
                max-width: 50%;
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                border: none;
            }
        `;
    }

    render() {
        return html`
            <iframe
                class="preview"
                src="${this.preview?.url ?? ''}"
            ></iframe>
        `;
    }
}

