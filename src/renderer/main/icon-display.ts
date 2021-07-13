
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { Icon } from 'common/result';

import 'renderer/common/material-icon';

@customElement('icon-display')
export class IconDisplay extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    icon?: Icon;

    @property({ attribute: false })
    fallback: string = '';

    @property({ attribute: false })
    error = false;

    onError() {
        this.error = true;
    }

    static get styles() {
        return css`
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }
            .image {
                width: 1.75rem;
                height: 1.75rem;
            }
            .icon {
                flex: 0 0 auto;
                margin-right: 0.5rem;
            }
            .fallback {
                font-family: var(--font-family);
                font-weight: 300;
            }
        `;
    }

    render() {
        if (this.icon?.url && !this.error) {
            return html`
                <img
                    class="image"
                    src="${this.icon.url}"
                    @error="${this.onError}"
                />
            `;
        } else if (this.icon?.material) {
            return html`
                <material-icon
                    class="icon"
                    name="${this.icon.material}"
                ></material-icon>
            `;
        } else {
            return html`
                <div class="fallback">${this.fallback}</div>
            `;
        }
    }
}

