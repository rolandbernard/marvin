
import { customElement, html, css, LitElement, property, TemplateResult } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { ipcRenderer } from 'electron';

import { GlobalConfig } from 'common/config';
import { ObjectConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';
import { DeepIndex, indexObject } from 'common/util';

import { getConfigStyles } from 'renderer/common/theme';

import 'renderer/styles/index.css';

import 'renderer/common/material-icon';
import 'renderer/settings/settings-page';

import Logo from 'logo.png';

@customElement('page-root')
export class PageRoot extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ObjectConfig;

    @property({ attribute: false })
    selected?: DeepIndex;

    constructor() {
        super();
        ipcRenderer.on('show', (_msg, config: GlobalConfig, desc: ObjectConfig) => {
            this.config = config;
            this.desc = desc;
            this.selectSomePage();
        });
    }

    getSelectedPage(): ObjectConfig | undefined {
        function indexWith(desc: ObjectConfig, list: DeepIndex): ObjectConfig | undefined {
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
        function findSomePage(desc: ObjectConfig, selection: DeepIndex = []): DeepIndex | undefined {
            const any = desc.options?.find(entry => entry.kind === 'page' || entry.kind === 'pages');
            if (any?.kind === 'page') {
                return selection.concat(any.name!);
            } else if (any?.kind === 'pages') {
                return findSomePage(any, selection.concat(any.name!));
            }
        }
        if (this.desc && !this.getSelectedPage()) {
            this.selected = findSomePage(this.desc);
        }
    }

    selectPage(index: DeepIndex) {
        this.selected = index;
    }

    buildConfigTabs() {
        const findConfigTabs =
            (desc: ObjectConfig, index: DeepIndex = []):
            (TemplateResult | undefined)[] | undefined => {
            return desc.options?.map(entry => {
                const entry_index = index.concat(entry.name!);
                const name = getTranslation(entry.name!, this.config);
                if (entry.kind === 'page') {
                    const active = indexObject(this.config, entry_index)?.active;
                    const activatable = active !== undefined;
                    const classes = classMap({
                        'tab': true,
                        'selected': entry_index.join('.') === this.selected!.join('.'),
                        'active': active,
                        'activatable': activatable,
                    });
                    return html`
                        <div
                            class="${classes}"
                            @click="${() => this.selectPage(entry_index)}"
                        >
                            <material-icon
                                class="icon"
                                name="${entry.icon ?? (activatable ? 'fiber_manual_record' : '')}"
                            ></material-icon>
                            <span>
                                ${name}
                            </span>
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

    onUpdate() {
        ipcRenderer.send('update-config', this.config);
    }

    static get styles() {
        return css`
            :host {
                width: 100%;
                height: 100%;
            }
            .window {
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: row nowrap;
                background: var(--settings-background);
                color: var(--settings-text-color);
                font-family: var(--font-family);
            }
            .sidebar {
                flex: 0 0 auto;
                display: flex;
                flex-flow: column;
            }
            .page {
                flex: 1 1 auto;
            }
            .header {
                flex: 0 0 auto;
                display: flex;
                flex-flow: column;
                align-items: flex-start;
                justify-content: center;
                padding: 2rem 1rem;
                background: var(--settings-transparent-background);
                height: 8rem;
                box-sizing: border-box;
                backdrop-filter: blur(5px);
                z-index: 100;
                margin-left: var(--scrollbar-width);
            }
            .logo-title {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;
                pointer-events: none;
            }
            .version {
                font-size: 0.75rem;
                padding-top: 0.5rem;
                opacity: 0.5;
                font-weight: 600;
            }
            .logo {
                width: 3rem;
                height: 3rem;
            }
            .title {
                font-size: 2rem;
                font-weight: 600;
                padding-left: 1rem;
            }
            .tab-drawer {
                flex: 1 1 auto;
                user-select: none;
                direction: rtl;
                overflow-y: overlay;
                padding-top: 8rem;
                margin-top: -8rem;
            }
            .tab-drawer::-webkit-scrollbar {
                width: var(--scrollbar-width);
            }
            .tab-drawer::-webkit-scrollbar-track,
            .tab-drawer::-webkit-scrollbar-track-piece,
            .tab-drawer::-webkit-resizer,
            .tab-drawer::-webkit-scrollbar-corner,
            .tab-drawer::-webkit-scrollbar-button {
                display: none;
            }
            .tab-drawer::-webkit-scrollbar-thumb {
                background: var(--settings-accent-color);
            }
            .tab {
                direction: ltr;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.8rem 1rem;
                transition: var(--transition);
                transition-property: background, color; 
                border-radius: 0 50rem 50rem 0;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;
                outline: none;
            }
            .tab:hover, .tab:focus-within {
                background: var(--settings-hover-background);
            }
            .tab.selected {
                background: var(--settings-selection-background);
                color: var(--settings-selection-text-color);
            }
            .tab .icon {
                flex: 0 0 auto;
                font-size: 1.5rem;
                width: 2.5rem;
                color: var(--settings-accent-color);
                justify-content: flex-start;
                transition: var(--transition);
                transition-property: text-shadow, color; 
            }
            .tab.activatable .icon {
                color: var(--settings-inactive-color);
            }
            .tab.activatable.active .icon {
                color: var(--settings-active-color);
                text-shadow: 0 0 0.25rem var(--settings-active-color);
            }
            .subheader {
                direction: ltr;
                font-size: 0.75rem;
                padding: 0.25rem 1rem;
                padding-top: 0.5rem;
                opacity: 0.75;
                font-weight: 600;
            }
        `;
    }

    render() {
        return html`
            <div
                class="window"
                style="${getConfigStyles(this.config)}"
            >
                <div class="sidebar">
                    <div class="header">
                        <div class="logo-title">
                            <img class="logo" src=${Logo} />
                            <div class="title">Settings</div>
                        </div>
                        <div class="version">
                            v${this.config?.version}
                            ${this.config?.platform}
                        </div>
                    </div>
                    <div class="tab-drawer">
                        ${this.buildConfigTabs()}
                    </div>
                </div>
                <settings-page
                    class="page"
                    .config="${this.config}"
                    .page="${this.getSelectedPage()}"
                    .index="${this.selected}"
                    @update="${this.onUpdate}"
                ></settings-page>
            </div>
        `;
    }
}

