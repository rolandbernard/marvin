
import { css, customElement, html, LitElement, property, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import { GlobalConfig } from 'common/config';
import { HtmlResult, Result, SimpleResult, TextResult } from 'common/result';
import { match } from 'common/util';

import 'renderer/common/results/simple-result';
import 'renderer/common/results/text-result';
import 'renderer/common/results/html-result';

@customElement('output-list')
export class OutputField extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    results?: Result[];

    @property({ attribute: false })
    selected = 0;

    @property({ attribute: false })
    centered = true;

    @query('.selected')
    element?: HTMLElement;

    updated() {
        if (this.centered) {
            this.element?.scrollIntoView({
                 behavior: this.config?.general.smooth_scrolling ? 'smooth' : 'auto',
                 block: 'center' 
            });
        }
    }

    onMouseMove(result: Result, index: number) {
        this.dispatchEvent(new CustomEvent('hover', {
            detail: { index, result }
        }));
    }

    onClick(result: Result, index: number) {
        this.dispatchEvent(new CustomEvent('execute', {
            detail: { index, result }
        }));
    }

    onDragStart(e: DragEvent, result: Result, index: number) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('drag', {
            detail: { index, result }
        }));
    }

    static get styles() {
        return css`
            :host {
                background: var(--output-background);
                text-align: left;
                contain: content;
            }
            .result {
                background: var(--output-background);
                color: var(--output-text-color);
                min-height: var(--min-element-height);
                transition: var(--transition);
                transition-property: background, color; 
                contain: content;
            }
            .result.selected {
                background: var(--output-selection-background);
                color: var(--output-selection-text-color);
                cursor: pointer;
            }
            .result-contain {
                contain: content;
            }
        `;
    }

    render() {
        return html`
            ${this.results?.map((result, i) => {
                const classes = classMap({
                    'selected': i === this.selected,
                });
                return html`
                    <div
                        class="result-contain"
                        @mousemove="${() => this.onMouseMove(result, i)}"
                        @click="${() => this.onClick(result, i)}"
                        @dragstart="${(e: DragEvent) => this.onDragStart(e, result, i)}"
                        draggable="${result.file ? 'true' : 'false'}"
                    >
                        ${match(result.kind, {
                            'simple-result': html`
                                <simple-result
                                    class="result ${classes}"
                                    .result="${result as SimpleResult}"
                                ></simple-result>
                            `,
                            'text-result': html`
                                <text-result
                                    class="result ${classes}"
                                    .result="${result as TextResult}"
                                ></text-result>
                            `,
                            'html-result': html`
                                <html-result
                                    class="result ${classes}"
                                    .result="${result as HtmlResult}"
                                ></html-result>
                            `,
                        })}
                    </div>
                `
            })}
        `;
    }
}

