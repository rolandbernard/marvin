
import { customElement, html, css, LitElement, property, TemplateResult, queryAll, query } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { ipcRenderer } from 'electron';

import { GlobalConfig } from 'common/config';
import { ObjectConfig } from 'common/config-desc';
import { getTranslation } from 'common/local/locale';
import { DeepIndex, indexObject } from 'common/util';
import { IpcChannels } from 'common/ipc';

import { getConfigStyles } from 'renderer/common/theme';

import 'renderer/common/ui/button-like';

import 'renderer/styles/index.css';

import 'renderer/common/ui/material-icon';
import 'renderer/settings/settings-page';

import Logo from 'logo.png';
import {SettingsPage} from 'renderer/settings/settings-page';

@customElement('page-root')
export class PageRoot extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    desc?: ObjectConfig;

    @property({ attribute: false })
    selected?: DeepIndex;

    @property({ attribute: false })
    visible?: DeepIndex;

    @queryAll('.page')
    pages?: SettingsPage[];

    @query('.page.selected')
    page?: SettingsPage;

    @query('.tab.selected')
    tab?: HTMLElement;

    moved: boolean = false;
    observer: IntersectionObserver;

    constructor() {
        super();
        this.observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                (entry.target as SettingsPage).visible = entry.isIntersecting
                    ? entry.intersectionRect.height
                    : 0;
            }
            this.onScroll();
        }, { threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });
        ipcRenderer.on(IpcChannels.SHOW_WINDOW, (_msg, config: GlobalConfig, desc: ObjectConfig) => {
            this.config = config;
            this.desc = desc;
            this.selectSomePage();
        });
    }

    getAllPages(): [ObjectConfig, DeepIndex][] {
        const pages: [ObjectConfig, DeepIndex][] = [];
        function computePages(desc: ObjectConfig, list: DeepIndex) {
            if (desc.options) {
                for (const opt of desc.options) {
                    if (opt.kind === 'page') {
                        pages.push([opt, [...list, opt.name!]]);
                    } else if (opt.kind === 'pages') {
                        computePages(opt, [...list, opt.name!]);
                    }
                }
            }
        }
        if (this.desc) {
            computePages(this.desc, []);
        }
        return pages;
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
            this.visible = this.selected;
        }
    }

    selectPage(index: DeepIndex) {
        if (this.selected?.join('.') !== index.join('.') || this.visible?.join('.') !== index.join('.')) {
            this.moved = false;
            this.selected = index;
            this.visible = index;
        }
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
                        'selected': entry_index.join('.') === this.visible?.join('.'),
                        'active': active,
                        'activatable': activatable,
                    });
                    return html`
                        <button-like class="tab-button">
                            <div
                                class="tab ${classes}"
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
                        </button-like>
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
        ipcRenderer.send(IpcChannels.UPDATE_CONFIG, this.config);
    }

    onScroll() {
        if (this.pages && this.page && this.page.visible === 0) {
            let max = 0;
            let max_page: SettingsPage | undefined = undefined;
            for (const page of this.pages) {
                if (page.visible > max) {
                    max = page.visible;
                    max_page = page;
                }
            }
            if (max_page && this.visible?.join('.') !== max_page.index?.join('.')) {
                this.visible = max_page.index;
            }
        }
    }

    updated() {
        if (this.tab) {
            this.tab?.scrollIntoView({
                block: 'nearest',
            });
        }
        if (this.page && !this.moved) {
            this.page?.scrollIntoView({
                 block: 'start',
            });
            this.moved = true;
        }
        if (this.pages) {
            this.observer.disconnect();
            for (const page of this.pages) {
                this.observer.observe(page);
            }
        }
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
                background: var(--settings-dark-background);
                color: var(--settings-text-color);
                font-family: var(--font-family);
                overflow: overlay;
            }
            .window::-webkit-scrollbar {
                width: var(--scrollbar-width);
                height: var(--scrollbar-width);
            }
            .window::-webkit-scrollbar-track,
            .window::-webkit-scrollbar-track-piece,
            .window::-webkit-resizer,
            .window::-webkit-scrollbar-corner,
            .window::-webkit-scrollbar-button {
                display: none;
            }
            .window::-webkit-scrollbar-thumb {
                background: var(--settings-selection-background);
            }
            .sidebar {
                flex: 0 0 auto;
                display: flex;
                flex-flow: column;
                user-select: none;
            }
            .header {
                flex: 0 0 auto;
                display: flex;
                flex-flow: column;
                align-items: flex-start;
                justify-content: center;
                padding: 2rem 1rem;
                background: var(--settings-transparent-background);
                height: 6rem;
                box-sizing: border-box;
                backdrop-filter: blur(5px);
                z-index: 100;
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
                width: 2.5rem;
                height: 2.5rem;
            }
            .title {
                font-size: 1.75rem;
                font-weight: 600;
                padding-left: 0.5rem;
            }
            .tab-drawer {
                flex: 1 1 auto;
                direction: rtl;
                overflow-y: overlay;
                padding-top: 7rem;
                margin-top: -6rem;
                padding-bottom: 1rem;
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
                background: var(--settings-selection-background);
            }
            .tab-button {
                border-radius: 0 50rem 50rem 0;
            }
            .tab {
                border-radius: 0 50rem 50rem 0;
                direction: ltr;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.8rem 1rem;
                transition: var(--transition);
                transition-property: background, color; 
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;
                outline: none;
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
            .page {
                display: block;
                padding-top: 2rem;
            }
            .pages {
                flex: 1 1 auto;
                overflow: overlay;
            }
            .pages::-webkit-scrollbar {
                width: var(--scrollbar-width);
                height: var(--scrollbar-width);
            }
            .pages::-webkit-scrollbar-track,
            .pages::-webkit-scrollbar-track-piece,
            .pages::-webkit-resizer,
            .pages::-webkit-scrollbar-corner,
            .pages::-webkit-scrollbar-button {
                display: none;
            }
            .pages::-webkit-scrollbar-thumb {
                background: var(--settings-selection-background);
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
                            <div class="title">${getTranslation('settings', this.config)}</div>
                        </div>
                        <div class="version">
                            v${this.config?.update.version}
                            ${this.config?.update.platform}
                        </div>
                    </div>
                    <div class="tab-drawer">
                        ${this.buildConfigTabs()}
                    </div>
                </div>
                <div class="pages">
                    ${this.getAllPages().map(([desc, index]) => {
                        const classes = classMap({
                            'selected': index.join('.') === this.selected!.join('.'),
                        });
                        return html`
                            <settings-page
                                class="page ${classes}"
                                .config="${this.config}"
                                .desc="${desc}"
                                .index="${index}"
                                @update="${this.onUpdate}"
                            ></settings-page>
                        `;
                    })}
                </div>
            </div>
        `;
    }
}

