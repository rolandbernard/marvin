
import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import { Icon } from 'common/result';

import 'renderer/common/ui/material-icon';

@customElement('image-wrapper')
export class ImageWrapper extends HTMLElement {
    url?: string;

    static get observedAttributes() {
        return ['src'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.render();
    }

    render() {
        const url = this.getAttribute('src');
        if (url && this.url !== url) {
            this.shadowRoot!.innerHTML = `<object style="width: 100%; height: 100%;" data="${url}" type="image/png"><slot></slot></object>`;
            this.url = url;
        }
    }

    attributeChangedCallback() {
        this.render();
    }
}

@customElement('icon-display')
export class IconDisplay extends LitElement {

    @property({ attribute: false })
    icon?: Icon;

    @property({ attribute: false })
    fallback: string = '';

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
                contain: strict;
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
        if (this.icon?.url) {
            return html`
                <image-wrapper class="icon image" src="${this.icon.url}">
                    <icon-display
                        .icon="${{ ...this.icon, url: undefined }}"
                        .fallback="${this.fallback}"
                    ></icon-display>
                </image-wrapper>
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

