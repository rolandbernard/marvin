
import { css, customElement, html, LitElement, property, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';
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

    onHover(index: number) {
        this.dispatchEvent(new CustomEvent('hover', {
            detail: { index }
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
            }
        `;
    }

    render() {
        return html`
            ${this.results?.map((result, i) => {
                const classes = classMap({
                    selected: i === this.selected,
                });
                return html`
                    <div @mousemove="${() => this.onHover(i)}">
                        ${match<any>(result.kind, {
                            'simple-result':
                                html`<simple-result class="${classes}" .result="${result}"></simple-result>`,
                            'text-result':
                                html`<text-result class="${classes}" .result="${result}"></text-result>`,
                            'html-result':
                                html`<html-result class="${classes}" .result="${result}"></html-result>`,
                        })}
                    </div>
                `
            })}
        `;
    }
}

