
import { ipcRenderer } from 'electron';
import { LitElement, property } from 'lit-element';

import { GlobalConfig } from 'common/config';
import { Result } from 'common/result';

export abstract class QueryExecutor extends LitElement {

    @property({ attribute: false })
    config?: GlobalConfig;

    @property({ attribute: false })
    query: string = '';

    @property({ attribute: false })
    results?: Result[] = [];

    @property({ attribute: false })
    selected = 0;

    @property({ attribute: false })
    centered = true;

    result_timeout?: NodeJS.Timeout;
    query_timeout?: NodeJS.Timeout;
    loading_timeout?: NodeJS.Timeout;

    constructor() {
        super();
        ipcRenderer.on('query-result', (_msg, results: Result[]) => {
            this.onQueryResult(results);
        });
    }

    onQueryResult(results: Result[]) {
        clearTimeout(this.result_timeout!);
        this.result_timeout = setTimeout(() => {
            clearTimeout(this.loading_timeout!);
            this.results = results;
            this.selected = 0;
            this.centered = true;
        }, this.config?.general.incremental_results ? this.config?.general.incremental_result_debounce : 0);
    }

    selectedResult(): Result | undefined {
        return this.results?.[this.selected];
    }

    sendQueryRequest() {
        clearTimeout(this.query_timeout!);
        this.query_timeout = setTimeout(() => {
            ipcRenderer.send('query', this.query);
        }, this.config?.general.debounce_time);
        clearTimeout(this.loading_timeout!);
        this.loading_timeout = setTimeout(() => {
            this.results = undefined;
        }, 100);
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

