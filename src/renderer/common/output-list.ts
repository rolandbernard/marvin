
import { css, customElement, html, LitElement, property, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';
import { match } from 'common/util';
import { Query } from 'common/query';

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

    @property({ attribute: false })
    query: string = '';

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

    onHover(result: Result, index: number) {
        this.dispatchEvent(new CustomEvent('hover', {
            detail: { index, result }
        }));
    }

    onClick(result: Result, index: number) {
        this.dispatchEvent(new CustomEvent('click', {
            detail: { index, result }
        }));
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-flow: column;
                align-items: stretch;
                background: var(--output-background);
            }
            .selected {
                background: var(--output-selection-background);
                color: var(--output-selection-text-color);
                cursor: pointer;
            }
        `;
    }

    render() {
        const query = new Query(this.query, this.config?.general.enhanced_search ?? false);
        return html`
            ${this.results?.map((result, i) => {
                const classes = classMap({
                    'selected': i === this.selected,
                });
                return html`
                    <div
                        @mousemove="${() => this.onHover(result, i)}"
                        @click="${() => this.onClick(result, i)}"
                    >
                        ${match(result.kind, {
                            'simple-result': html`
                                <simple-result
                                    class="${classes}"
                                    .result="${result}"
                                    .query="${query}"
                                ></simple-result>
                            `,
                            'text-result': html`
                                <text-result
                                    class="${classes}"
                                    .result="${result}"
                                    .query="${query}"
                                ></text-result>
                            `,
                            'html-result': html`
                                <html-result
                                    class="${classes}"
                                    .result="${result}"
                                    .query="${query}"
                                ></html-result>
                            `,
                        })}
                    </div>
                `
            })}
        `;
    }
}

