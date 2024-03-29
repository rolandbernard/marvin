
import { app, BrowserWindow, dialog, ipcMain, WebContents } from 'electron';

import { Result, getResultKey } from 'common/result';
import { Query } from 'common/query';
import { GlobalConfig } from 'common/config';
import { mergeDeep } from 'common/util';
import { THEMES } from 'common/themes';
import { IpcChannels } from 'common/ipc';

import { executeResult, searchQuery, filterAndSortQueryResults } from 'main/execution/executor';
import { config, resetConfig, updateConfig } from 'main/config';
import { updateModules } from 'main/modules';

// This variable is used to ensure that if a earlier query finishes after a later query, it will not
// actually send the results to the renderer.
let query_count = 0;
let result_count = 0;

// Time of last result send. Must be at least incremental_results_debounce (of finished) before
// sending again. (This is to reduce the amount of data send.)
let last_send = 0;

// Cancel the last result promise.
let cancel_last_results = () => { };

const MAX_TRANSFER_LEN = 200; // Text in the results sent to the renderer will be cropped to this length.

// This stores the original_options because we only send cropped text fields.
// (Fixes a performance issue when the clipboard contains a very long text)
const original_option: Record<number, Result[]> = {};

type RunnerResult = Result & {
    result: number,
    id: number,
};

function transformResultArray(results: Result[]): RunnerResult[] {
    result_count++;
    delete original_option[result_count - 16];
    original_option[result_count] = [];
    return filterAndSortQueryResults(results).map((opt, id) => {
        const reduced_option: RunnerResult = { ...opt, id, result: result_count };
        if (reduced_option.kind === 'text-result') {
            if (reduced_option.text.length > MAX_TRANSFER_LEN) {
                reduced_option.text = reduced_option.text.substring(0, MAX_TRANSFER_LEN) + '...';
            }
        } else if (reduced_option.kind === 'simple-result') {
            if ((reduced_option.primary?.length ?? 0) > MAX_TRANSFER_LEN) {
                reduced_option.primary = reduced_option.primary.substring(0, MAX_TRANSFER_LEN) + '...';
            }
            if ((reduced_option.secondary?.length ?? 0) > MAX_TRANSFER_LEN) {
                reduced_option.secondary = reduced_option.secondary?.substring(0, MAX_TRANSFER_LEN) + '...';
            }
        }
        if ((reduced_option.autocomplete?.length ?? 0) > MAX_TRANSFER_LEN) {
            reduced_option.autocomplete = reduced_option.autocomplete?.substring(0, MAX_TRANSFER_LEN);
        }
        original_option[result_count][id] = opt;
        return reduced_option;
    });
}

function sendUpdatedOptions(id: number, sender: WebContents, results: Result[], finished: boolean) {
    if (id === query_count) {
        if (finished || (Date.now() - last_send) > config.general.result_debounce) {
            last_send = Date.now();
            sender.send(IpcChannels.SEARCH_RESULT, transformResultArray(results), finished);
        }
    }
}

export async function handleQuery(query: string, sender: WebContents) {
    last_send = Date.now();
    query_count++;
    const begin_count = query_count;
    cancel_last_results();
    const results = await Promise.race([
        new Promise<Result[]>(resolve => { cancel_last_results = () => resolve([]) }),
        searchQuery(
            new Query(query, query, config.general.enhanced_search),
            config.general.incremental_results
                ? (results) => results.length !== 0 && sendUpdatedOptions(begin_count, sender, results, false)
                : undefined
        )
    ]);
    sendUpdatedOptions(begin_count, sender, results, true);
}

ipcMain.on(IpcChannels.SEARCH_QUERY, (msg, query: string) => {
    handleQuery(query, msg.sender);
});

ipcMain.on(IpcChannels.EXECUTE_RESULT, (_msg, result: RunnerResult) => {
    if (
        result.result in original_option
        && result.id in original_option[result.result]
    ) {
        executeResult(original_option[result.result][result.id]);
    } else {
        executeResult(result);
    }
});

ipcMain.on(IpcChannels.DRAG_RESULT, async (event, option: Result) => {
    if (option.file) {
        event.sender.startDrag({
            file: option.file,
            icon: (await app.getFileIcon(option.file)),
        })
    }
});

ipcMain.on(IpcChannels.UPDATE_CONFIG, async (msg, new_config: GlobalConfig) => {
    await updateConfig(new_config);
    msg.sender.send(IpcChannels.SHOW_WINDOW, config, config.getDescription());
    await updateModules();
});

ipcMain.on(IpcChannels.RESET_CONFIG, async (msg) => {
    await resetConfig();
    msg.sender.send(IpcChannels.SHOW_WINDOW, config, config.getDescription());
    await updateModules();
});

ipcMain.on(IpcChannels.CHANGE_THEME, async (msg, theme: keyof typeof THEMES) => {
    mergeDeep(config.theme, THEMES[theme]);
    await updateConfig();
    msg.sender.send(IpcChannels.SHOW_WINDOW, config, config.getDescription());
    await updateModules();
});

ipcMain.handle(IpcChannels.SHOW_DIALOG, (msg, text: string) => {
    const window = BrowserWindow.fromWebContents(msg.sender);
    if (window) {
        return dialog.showMessageBoxSync(window, {
            message: text,
            title: 'Marvin',
            buttons: ['Cancel', 'Ok'],
        });
    } else {
        return true;
    }
});

