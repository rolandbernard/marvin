
import { app, ipcMain, WebContents } from 'electron';

import { Result } from 'common/result';
import { Query } from 'common/query';
import { GlobalConfig } from 'common/config';
import { mergeDeep } from 'common/util';
import { THEMES } from 'common/themes';

import { executeResult, searchQuery } from 'main/executor';
import { config, resetConfig, updateConfig } from 'main/config';
import { updateModules } from 'main/modules';

const MAX_TRANSFER_LEN = 200; // Text in the results sent to the renderer will be cropped to this length.

// This stores the original_options because we only send cropped text fields.
// (Fixes a performance issue when the clipboard contains a very long text)
const original_option: Result[] = [];

// This variable is used to ensure that if a earlier query finishes after a later query, it will not
// actually sen the results to the renderer.
let execution_count = 0;

type RunnerResult = Result & {
    id: number
};

function sendUpdatedOptions(id: number, sender: WebContents, results: Result[]) {
    if (id === execution_count) {
        original_option.length = 0;
        sender.send('query-result', results.map((opt, id) => {
            const reduced_option: RunnerResult = { ...opt, id: id };
            if (reduced_option.kind === 'text-result') {
                if (reduced_option.text.length > MAX_TRANSFER_LEN) {
                    reduced_option.text = reduced_option.text.substr(0, MAX_TRANSFER_LEN) + '...';
                }
            } else if (reduced_option.kind === 'simple-result') {
                if (reduced_option.primary?.length > MAX_TRANSFER_LEN) {
                    reduced_option.primary = reduced_option.primary.substr(0, MAX_TRANSFER_LEN) + '...';
                }
                if ((reduced_option.secondary?.length ?? 0) > MAX_TRANSFER_LEN) {
                    reduced_option.secondary = reduced_option.secondary?.substr(0, MAX_TRANSFER_LEN) + '...';
                }
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
        new Query(query, query, config.general.enhanced_search),
        config.general.incremental_results
            ? (results) => sendUpdatedOptions(begin_count, sender, results)
            : undefined
    );
    sendUpdatedOptions(begin_count, sender, results);
}

ipcMain.on('query', (msg, query: string) => {
    handleQuery(query, msg.sender);
});

ipcMain.on('execute', (_msg, result: RunnerResult) => {
    const key = result.id;
    if (key in original_option) {
        executeResult(original_option[key]);
    } else {
        executeResult(result);
    }
});

ipcMain.on('drag', async (event, option: Result) => {
    if (option.file) {
        event.sender.startDrag({
            file: option.file,
            icon: (await app.getFileIcon(option.file)),
        })
    }
});

ipcMain.on('update-config', async (msg, new_config: GlobalConfig) => {
    await updateConfig(new_config);
    msg.sender.send('show', config, config.getDescription());
    await updateModules();
});

ipcMain.on('reset-config', async (msg) => {
    await resetConfig();
    msg.sender.send('show', config, config.getDescription());
    await updateModules();
});

ipcMain.on('change-theme', async (msg, theme: keyof typeof THEMES) => {
    mergeDeep(config.theme, THEMES[theme]);
    await updateConfig();
    msg.sender.send('show', config, config.getDescription());
    await updateModules();
});

