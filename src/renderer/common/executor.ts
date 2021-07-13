
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
            clearTimeout(this.result_timeout!);
            this.result_timeout = setTimeout(() => {
                clearTimeout(this.loading_timeout!);
                this.results = results;
                this.selected = 0;
                this.centered = true;
            }, this.config?.general.incremental_result_debounce);
        });
    }

    onQueryChange(e: CustomEvent) {
        this.query = e.detail.value;
        clearTimeout(this.query_timeout!);
        this.query_timeout = setTimeout(() => {
            ipcRenderer.send('query', this.query);
        }, this.config?.general.debounce_time);
        clearTimeout(this.loading_timeout!);
        this.loading_timeout = setTimeout(() => {
            this.results = undefined;
        }, 200);
    }

    abstract executeResult(result: Result): unknown;
}

