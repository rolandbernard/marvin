
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Preview } from 'common/result';
import { importAll, fakeTemplateArray } from 'common/util';

importAll(require.context('./previews', true, /\.ts$/));

const template_cache: Record<string, TemplateStringsArray | undefined> = {};

@customElement('some-preview')
export class SomePreview extends LitElement {

    @property({ attribute: false })
    preview?: Preview;

    element(tag: string, ...attributes: any[]) {
        let template = template_cache[tag];
        if (!template) {
            template = fakeTemplateArray([
                `<${tag} .preview="`,
                `"></${tag}>`,
            ]);
            template_cache[tag] = template;
        }
        return html(template, ...attributes);
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

