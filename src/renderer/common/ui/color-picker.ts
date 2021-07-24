
import { css, customElement, html, LitElement, property, query } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';

import { Color, colorAsHex, hsvToRgb } from 'common/color';

@customElement('color-picker')
export class ColorPicker extends LitElement {

    @property({ attribute: false })
    color: Color = [0, 0, 0, 0]; // HSVA color

    @property({ attribute: false })
    top = false;

    @query('.field')
    field?: HTMLDivElement;

    @query('.hue')
    hue?: HTMLDivElement;

    @query('.alpha')
    alpha?: HTMLDivElement;

    onChange() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: this.color,
            }
        }));
    }

    doOnMove(func: (e: MouseEvent) => unknown, event?: MouseEvent) {
        const onMouseUp = () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', func);
        }
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', func);
        if (event) {
            func(event);
        }
    }

    onFieldMouse(event: MouseEvent) {
        this.doOnMove((event: MouseEvent) => {
            if (this.field) {
                const rect = this.field.getBoundingClientRect();
                this.color = [
                    this.color[0],
                    Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
                    Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height)),
                    this.color[3],
                ];
                this.onChange();
            }
        }, event);
    }

    onHueMouse(event: MouseEvent) {
        this.doOnMove((event: MouseEvent) => {
            if (this.hue) {
                const rect = this.hue.getBoundingClientRect();
                this.color = [
                    Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
                    this.color[1], this.color[2], this.color[3],
                ];
                this.onChange();
            }
        }, event);
    }

    onAlphaMouse(event: MouseEvent) {
        this.doOnMove((event: MouseEvent) => {
            if (this.alpha) {
                const rect = this.alpha.getBoundingClientRect();
                this.color = [
                    this.color[0], this.color[1], this.color[2],
                    Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
                ];
                this.onChange();
            }
        }, event);
    }

    static get styles() {
        return css`
            :host {
                display: block;
                height: 100%;
            }
            .wrapper {
                height: 100%;
                display: flex;
                flex-flow: column;
                align-items: stretch;
                justify-content: stretch;
            }
            .field {
                flex: 1 1 auto;
                position: relative;
                cursor: pointer;
            }
            .hue-color, .saturation, .value {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
            .hue-color {
                background: var(--hue-color);
            }
            .saturation {
                background: linear-gradient(to right, white, rgba(255, 255, 255, 0));
            }
            .value {
                background: linear-gradient(to top, black, rgba(0, 0, 0, 0));
            }
            .field .handle {
                width: 0.5rem;
                height: 0.5rem;
                border: 2px solid white;
                position: absolute;
                bottom: calc(100% * var(--value));
                left: calc(100% * var(--saturation));
                transform: translate(-50%, 50%);
                border-radius: 50%;
                transition: var(--transition);
                transition-property: width, height;
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
            }
            .field .handle:hover {
                width: 0.6rem;
                height: 0.6rem;
            }
            .bottom {
                display: flex;
                flex-flow: row nowrap;
                align-items: stretch;
                justify-content: stretch;
            }
            .current {
                flex: 0 0 auto;
                width: 3rem;
                height: 3rem;
                border-radius: var(--settings-input-border-radius);
                border: 1px solid var(--settings-border-color);
                overflow: hidden;
                background:
                    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=")
                    repeat;
                margin: 0.5rem;
            }
            .color {
                background: var(--color);
                width: 100%;
                height: 100%;
            }
            .sliders {
                flex: 1 1 auto;
                display: flex;
                flex-flow: column;
                align-items: stretch;
                justify-content: space-evenly;
            }
            .hue, .alpha {
                flex: 0 0 auto;
                height: 1rem;
                position: relative;
                cursor: pointer;
                margin: 0 0.75rem;
            }
            .sliders .handle {
                width: 1.1rem;
                height: 1.1rem;
                background: white;
                box-shadow: var(--box-shadow-position) var(--settings-shadow-color);
                position: absolute;
                transform: translate(-50%, -50%);
                z-index: 10;
                border-radius: 50%;
                top: 50%;
                cursor: pointer;
                transition: var(--transition);
                transition-property: width, height;
            }
            .sliders .handle:hover {
                width: 1.2rem;
                height: 1.2rem;
            }
            .hue {
                background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
            }
            .hue .handle {
                left: calc(100% * var(--hue));
            }
            .alpha {
                background:
                    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAHUlEQVQ4jWNgYGAQIYAJglEDhoUBg9+FowbQ2gAARjwKARjtnN8AAAAASUVORK5CYII=")
                    repeat;
            }
            .black {
                background: linear-gradient(to right, rgba(0, 0, 0, 0), black);
                height: 100%;
            }
            .alpha .handle {
                left: calc(100% * var(--alpha));
            }
        `;
    }

    render() {
        const rgb = hsvToRgb(this.color);
        const hue = hsvToRgb([this.color[0], 1, 1]);
        const styles = styleMap({
            '--hue-color': colorAsHex(hue),
            '--color': colorAsHex(rgb),
            '--hue': this.color[0].toString(),
            '--saturation': this.color[1].toString(),
            '--value': this.color[2].toString(),
            '--alpha': (this.color[3] ?? 1).toString(),
        });
        const field = html`
            <div
                class="field"
                @mousedown="${this.onFieldMouse}"
            >
                <div class="hue-color"></div>
                <div class="saturation"></div>
                <div class="value"></div>
                <div class="handle"></div>
            </div>
        `;
        return html`
            <div class="wrapper" style="${styles}">
                ${this.top ? field : undefined}
                <div class="bottom">
                    <div class="sliders">
                        <div
                            class="hue"
                            @mousedown="${this.onHueMouse}"
                        >
                            <div class="handle"></div>
                        </div>
                        <div
                            class="alpha"
                            @mousedown="${this.onAlphaMouse}"
                        >
                            <div class="black"></div>
                            <div class="handle"></div>
                        </div>
                    </div>
                    <div class="current">
                        <div class="color"></div>
                    </div>
                </div>
                ${this.top ? undefined : field}
            </div>
        `;
    }
}

