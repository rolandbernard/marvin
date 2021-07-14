
import { customElement, html, css, LitElement, property, TemplateResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { ipcRenderer } from 'electron';

import { GlobalConfig } from 'common/config';
import { ObjectConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';

import { getConfigStyles } from 'renderer/common/theme';

import 'renderer/styles/index.css';

@customElement('page-root')
export class PageRoot extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ObjectConfig;

    @property({ attribute: false })
    selected?: string[];

    constructor() {
        super();
        ipcRenderer.on('show', (_msg, config: GlobalConfig, desc: ObjectConfig) => {
            this.config = config;
            this.desc = desc;
            this.selectSomePage();
        });
    }

    getSelectedPage(): ObjectConfig | undefined {
        function indexWith(desc: ObjectConfig, list: string[]): ObjectConfig | undefined {
            if (list.length === 0) {
                return desc;
            } else {
                const selected = desc.options?.find(opt => opt.name === list[0]);
                if (selected?.kind === 'page' || selected?.kind === 'pages') {
                    return indexWith(selected, list.slice(1));
                }
            }
        }
        if (this.desc && this.selected) {
            return indexWith(this.desc, this.selected);
        }
    }

    selectSomePage() {
        function findSomePage(desc: ObjectConfig, selection: string[] = []): string[] | undefined {
            const any = desc.options?.find(entry => entry.kind === 'page' || entry.kind === 'pages');
            if (any?.kind === 'page') {
                return [ ...selection, any.name! ];
            } else if (any?.kind === 'pages') {
                return findSomePage(any, [ ...selection, any.name! ]);
            }
        }
        if (this.desc && !this.getSelectedPage()) {
            this.selected = findSomePage(this.desc);
        }
    }

    buildConfigTabs() {
        const findConfigTabs =
            (desc: ObjectConfig, index: string[] = []):
            (TemplateResult | undefined)[] | undefined => {
            return desc.options?.map(entry => {
                const entry_index = [ ...index, entry.name! ];
                const classes = classMap({
                    'tab': true,
                    'selected': entry_index.join('.') === this.selected!.join('.'),
                });
                const name = getTranslation(entry.name!, this.config);
                if (entry.kind === 'page') {
                    return html`
                        <div class="${classes}">
                            ${name}
                        </div>
                    `;
                } else if (entry.kind === 'pages') {
                    return html`
                        <div class="subheader">
                            ${name}
                        </div>
                        ${findConfigTabs(entry, entry_index)}
                    `;
                }
            });
        }
        if (this.desc && this.selected) {
            return findConfigTabs(this.desc);
        }
    }

    static get styles() {
        return css`
            :host, .window {
                width: 100%;
                height: 100%;
            }
        `;
    }

    render() {
        return html`
            <div
                class="window"
                style="${getConfigStyles(this.config)}"
            >
                <div class="tab-drawer">
                    <div class="header">
                    </div>
                    ${this.buildConfigTabs()}
                </div>
                <settings-page></settings-page>
            <div>
        `;
    }
}

