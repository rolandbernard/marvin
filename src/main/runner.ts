
import { app, ipcMain, WebContents } from 'electron';

import { Result } from 'common/result';
import { Query } from 'common/query';

import { executeResult, searchQuery } from 'main/executor';
import { config } from 'main/config';

const MAX_TRANSFER_LEN = 200; // Text in the results sent to the renderer will be cropped to this length.

// This stores the original_options because we only send cropped text fields.
// (Fixes a performance issue when the clipboard contains a very long text)
const original_option: Result[] = [];

// This variable is used to ensure that if a earlier query finishes after a later query, it will not
// actually sen the results to the renderer.
let execution_count = 0;

function sendUpdatedOptions(id: number, sender: WebContents, results: Result[]) {
    if (id === execution_count) {
        original_option.length = 0;
        sender.send('query-result', results.map((opt, id) => {
            const reduced_option: any = { ...opt, id: id };
            if (reduced_option.text?.length > MAX_TRANSFER_LEN) {
                reduced_option.text = reduced_option.text.substr(0, MAX_TRANSFER_LEN) + '...';
            }
            if (reduced_option.primary?.length > MAX_TRANSFER_LEN) {
                reduced_option.primary = reduced_option.primary.substr(0, MAX_TRANSFER_LEN) + '...';
            }
            if (reduced_option.secondary?.length > MAX_TRANSFER_LEN) {
                reduced_option.secondary = reduced_option.secondary.substr(0, MAX_TRANSFER_LEN) + '...';
            }
            original_option[id] = opt;
            return reduced_option;
        }));
    }
}

async function handleQuery(query: string, sender: WebContents) {
    execution_count++;
    const begin_count = execution_count;
    const results = await searchQuery(
        new Query(config, query),
        config.general.incremental_results
            ? (results) => sendUpdatedOptions(begin_count, sender, results)
            : undefined
    );
    sendUpdatedOptions(begin_count, sender, results);
}

ipcMain.on('query', (msg, query) => {
    handleQuery(query, msg.sender);
});

ipcMain.on('execute', (_, option) => {
    if (option && option.executable) {
        const key = option.id;
        if (key in original_option) {
            executeResult(original_option[key]);
        } else {
            executeResult(option);
        }
    }
});

ipcMain.on('drag-start', async (event, option: Result) => {
    if (option.file) {
        event.sender.startDrag({
            file: option.file,
            icon: (await app.getFileIcon(option.file)),
        })
    }
});

