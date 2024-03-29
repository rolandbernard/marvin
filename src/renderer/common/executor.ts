
import { ipcRenderer } from 'electron';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';
import { IpcChannels } from 'common/ipc';

export abstract class QueryExecutor extends LitElement {
    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    query: string = '';

    @property({ attribute: false })
    results?: Result[] = [];

    @property({ attribute: false })
    loading = false;

    @property({ attribute: false })
    selected = 0;

    @property({ attribute: false })
    centered = true;

    result_timeout?: NodeJS.Timeout;
    query_timeout?: NodeJS.Timeout;
    loading_timeout?: NodeJS.Timeout;

    constructor() {
        super();
        ipcRenderer.on(IpcChannels.SEARCH_RESULT, (_msg, results: Result[], finished: boolean) => {
            this.onQueryResult(results, finished);
        });
    }

    onQueryResult(results: Result[], finished: boolean) {
        clearTimeout(this.result_timeout!);
        if (finished) {
            this.results = results;
            this.selected = 0;
            this.centered = true;
            this.loading_timeout = setTimeout(() => {
                this.loading = false;
            }, 300);
        } else {
            this.results = results;
            this.selected = 0;
            this.centered = true;
        }
    }

    selectedResult(): Result | undefined {
        return this.results?.[this.selected];
    }

    sendQueryRequest() {
        clearTimeout(this.result_timeout!);
        clearTimeout(this.loading_timeout!);
        clearTimeout(this.query_timeout!);
        this.loading = true;
        this.query_timeout = setTimeout(() => {
            ipcRenderer.send(IpcChannels.SEARCH_QUERY, this.query);
            this.result_timeout = setTimeout(() => {
                this.results = [];
            }, (this.config?.general.result_debounce ?? 0) + (this.config?.general.incremental_results ? 100 : 0));
        }, this.config?.general.debounce_time);
    }

    onQueryChange(e: CustomEvent) {
        this.query = e.detail.value;
        this.sendQueryRequest();
    }

    onHover(e: CustomEvent) {
        this.selected = e.detail.index;
        this.centered = false;
    }

    onExecute(e: CustomEvent) {
        this.executeResult(e.detail.result);
    }

    onKeyDown(e: KeyboardEvent) {
        const length = this.results?.length || 1;
        const selected = this.selectedResult();;
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selected = (this.selected + length - 1) % length;
            this.centered = true;
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selected = (this.selected + length + 1) % length;
            this.centered = true;
        } else if (e.key === 'Escape') {
            window.close();
            e.preventDefault();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selected) {
                this.executeResult(selected);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (selected?.autocomplete) {
                this.query = selected.autocomplete;
                this.sendQueryRequest();
            }
        }
    }

    abstract executeResult(result: Result): unknown;
}

