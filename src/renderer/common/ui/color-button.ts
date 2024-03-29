
import { LitElement, css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

import { Color, colorAsHex, hsvToRgb, parseColor, rgbToHsv } from 'common/color';

import 'renderer/common/ui/button-like';
import 'renderer/common/ui/color-picker';

@customElement('color-button')
export class ColorButton extends LitElement {

    @property({ attribute: false })
    color: string = '#fff';

    @property({ attribute: false })
    disabled?: boolean;

    @property({ attribute: false })
    open = false;

    @property({ attribute: false })
    top = false;

    @query('.button')
    button?: HTMLButtonElement;

    temp: Color = [0, 0, 0, 0];

    onChange(event: CustomEvent) {
        this.temp = event.detail.value;
    }

    onOpen() {
        this.open = true;
        this.temp = rgbToHsv(parseColor(this.color));
        setTimeout(() => {
            // Only at after this event was handled
            const handle = () => {
                window.removeEventListener('click', handle);
                this.onClose();
            }
            window.addEventListener('click', handle);
        });
    }

    onClose() {
        this.open = false;
        if (this.temp) {
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    value: colorAsHex(hsvToRgb(this.temp)),
                }
            }));
        }
    }

    eventBorder(event: Event) {
        event.stopPropagation();
    }

    updated() {
        if (this.button) {
            const rect = this.button.getBoundingClientRect();
            if (rect.top + rect.bottom > window.innerHeight) {
                this.top = true;
            } else {
                this.top = false;
            }
        }
    }

    static get styles() {
        return css`
            .wrapper {
                position: relative;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .button {
                background: var(--settings-background);
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
                transition: var(--transition);
                transition-property: border; 
                color: var(--settings-text-color);
                user-select: none;
                appearance: none;
                padding: 0;
                margin: 0;
                outline: none;
                overflow: hidden;
            }
            .enabled .button:hover {
                border: 1px solid var(--settings-border-hover-color);
                cursor: pointer;
            }
            .disabled .button {
                color: var(--settings-border-hover-color);
                pointer-events: none;
            }
            .current {
                flex: 0 0 auto;
                width: 3rem;
                height: 3rem;
                overflow: hidden;
                background:
                    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=")
                    repeat;
            }
            .color {
                background: var(--color);
                width: 100%;
                height: 100%;
            }
            .picker {
                width: 20rem;
                height: 20rem;
                min-height: 7.5rem;
                max-height: 80vh;
                min-width: 7.5rem;
                max-width: 50vw;
                top: -0.5rem;
                right: -0.5rem;
                position: absolute;
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                border-radius: var(--settings-input-border-radius);
                background: var(--settings-background);
                z-index: 100;
                transition: var(--transition);
                transition-property: opacity, visibility, top;
                opacity: 0;
                visibility: hidden;
                outline: none;
                overflow: hidden;
            }
            .top .picker {
                top: auto;
                bottom: -0.5rem;
                right: -0.5rem;
            }
            .open .picker {
                opacity: 1;
                visibility: visible;
            }
        `;
    }

    render() {
        const styles = styleMap({
            '--color': this.color,
        });
        const classes = classMap({
            'enabled': !this.disabled,
            'disabled': this.disabled ? true : false,
            'open': this.open,
            'top': this.top,
        });
        return html`
            <div class="wrapper ${classes}">
                <button class="button" @click="${this.onOpen}">
                    <button-like
                        .disabled=${this.disabled}
                    >
                        <div class="current" style="${styles}">
                            <div class="color"></div>
                        </div>
                    </button-like>
                </button>
                <div class="picker" @click="${this.eventBorder}">
                    <color-picker
                        class="color-picker"
                        .color="${this.temp}"
                        .top="${this.top}"
                        @change="${this.onChange}"
                    ></color-picker>
                </div>
            </div>
        `;
    }
}

