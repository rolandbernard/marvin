
import { customElement, html, LitElement, property } from 'lit-element';

import { Preview } from 'common/result';

import 'renderer/main/previews/audio-preview';
import 'renderer/main/previews/color-preview';
import 'renderer/main/previews/embed-preview';
import 'renderer/main/previews/iframe-preview';
import 'renderer/main/previews/image-preview';
import 'renderer/main/previews/video-preview';

@customElement('some-preview')
export class SomePreview extends LitElement {

    @property({ attribute: false })
    preview?: Preview;

    element(tag: string, ...attributes: any[]) {
        return html([
            `<${tag} .preview="`,
            `"></${tag}>`,
        ] as any, ...attributes);
    }

    render() {
        if (this.preview) {
            return this.element(this.preview.kind, this.preview);
        }
    }
}

