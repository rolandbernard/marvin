
import { customElement, html, LitElement } from 'lit-element';

@customElement('page-root')
export class PageRoot extends LitElement {

    render() {
        return html`
            <h1>Hello world</h1>
        `;
    }
}

console.log('app.ts');

