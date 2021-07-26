
import { css, customElement, html, LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { Icon } from 'common/result';

import 'renderer/common/ui/material-icon';

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
                user-select: none;
            }
            .icon {
                width: 2rem;
                height: 2rem;
                flex: 0 0 auto;
                overflow: hidden;
            }
            .fallback {
                font-family: var(--font-family);
                font-weight: 300;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
    }

    render() {
        if (this.icon?.url && !this.error) {
            return html`
                <img
                    class="icon image"
                    src="${this.icon.url}"
                    @error="${this.onError}"
                />
            `;
        } else if (this.icon?.material) {
            return html`
                <material-icon
                    class="icon material"
                    name="${this.icon.material}"
                ></material-icon>
            `;
        } else {
            return html`
                <div class="icon fallback">${this.fallback}</div>
            `;
        }
    }
}

