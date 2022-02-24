
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { ColorPreview } from 'common/result';

@customElement('color-preview')
export class ColorPreviewComponent extends LitElement {

    @property({ attribute: false })
    preview?: ColorPreview;

    static get styles() {
        return css`
            :host {
                display: block;
                position: relative;
            }
            .wrapper {
                position: absolute;
                width: 3rem;
                height: 100%;
                right: 0;
                top: 0;
                background: white;
            }
            .background {
                width: 100%;
                height: 100%;
                background:
                    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=")
                    repeat;
            }
            .color {
                width: 100%;
                height: 100%;
                background: var(--color);
            }
        `;
    }

    render() {
        const styles = styleMap({
            '--color': this.preview?.color ?? 'transparent',
        }) 
        return html`
            <div class="wrapper">
                <div class="background">
                    <div class="color" style="${styles}">
                    </div>
                </div>
            </div>
        `;
    }
}

