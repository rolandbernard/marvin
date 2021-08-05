
import { css, customElement, html, LitElement, property } from 'lit-element';

import { Preview } from 'common/result';
import { importAll } from 'common/util';

importAll(require.context('./previews', true, /\.ts$/));

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

    static get styles() {
        return css`
            :host {
                display: contents;
            }
        `;
    }

    render() {
        if (this.preview) {
            return this.element(this.preview.kind, this.preview);
        }
    }
}

