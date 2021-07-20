
import { css, customElement, html, LitElement, property } from 'lit-element';

import { FilePreview } from 'common/result';

@customElement('iframe-preview')
export class IFramePreview extends LitElement {

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

