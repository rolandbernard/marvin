
import { workerData, parentPort } from 'worker_threads';

import { Query } from 'common/query';
import { ModuleId } from 'common/module';
import { Result, getResultKey } from 'common/result';

import { moduleForId } from 'main/modules';
import { updateConfig } from 'main/config';
import { filterAndSortQueryResults } from 'main/execution/executor';
import { WorkerIpcCommand, WorkerIpcResponse, WorkerData } from 'main/execution/worker-ipc'

const worker_data: WorkerData = workerData;
const module_id: ModuleId = worker_data.module;

const MAX_TRANSFER_LEN = 200; // Text in the results sent to the renderer will be cropped to this length.

// This stores the original_options because we only send cropped text fields.
// (Fixes a performance issue when the clipboard contains a very long text)
const original_option: Result[] = [];

type WorkerResult = Result & {
    id: number
};

function transformResultArray(results: Result[]): WorkerResult[] {
    original_option.length = 0;
    return filterAndSortQueryResults(results).map((opt, id) => {
        const reduced_option: WorkerResult = { ...opt, id: id };
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
        if ((reduced_option.autocomplete?.length ?? 0) > MAX_TRANSFER_LEN) {
            reduced_option.autocomplete = reduced_option.autocomplete?.substr(0, MAX_TRANSFER_LEN);
        }
        original_option[id] = opt;
        return reduced_option;
    });
}

async function runWorkerCommand(command: WorkerIpcCommand): Promise<WorkerIpcResponse> {
    let result: WorkerIpcResponse;
    try {
        switch (command.kind) {
            case 'init': {
                await updateConfig(command.config);
                await moduleForId(module_id)?.init?.();
                result = { kind: 'void' };
                break;
            }
            case 'update': {
                await updateConfig(command.config);
                await moduleForId(module_id)?.update?.();
                result = { kind: 'void' };
                break;
            }
            case 'deinit': {
                await moduleForId(module_id)?.deinit?.();
                result = { kind: 'void' };
                break;
            }
            case 'refresh': {
                await moduleForId(module_id)?.refresh?.();
                result = { kind: 'void' };
                break;
            }
            case 'search': {
                const query = new Query(command.query.raw, command.query.text, command.query.advanced);
                const res = await moduleForId(module_id)?.search?.(query);
                result = { kind: 'results', results: transformResultArray(res ?? []) };
                break;
            }
            case 'rebuild': {
                const query = new Query(command.query.raw, command.query.text, command.query.advanced);
                const res = await moduleForId(module_id)?.rebuild?.(query, command.result);
                result = { kind: 'result', result: res };
                break;
            }
            case 'execute': {
                const key = (command.result as WorkerResult).id;
                if (
                    key in original_option
                    && getResultKey(original_option[key]) === getResultKey(command.result)
                ) {
                    command.result = original_option[key];
                }
                await moduleForId(module_id)?.execute?.(command.result);
                result = { kind: 'result', result: command.result };
                break;
            }
            case 'execute-any': {
                await moduleForId(module_id)?.executeAny?.(command.result);
                result = { kind: 'void' };
                break;
            }
            case 'call': {
                await (moduleForId(module_id) as any)?.[command.method]?.();
                result = { kind: 'void' };
                break;
            }
        }
    } catch (e) {
        result = { kind: 'error' };
    }
    result.id = command.id;
    return result;
}

parentPort?.on('message', async (command: WorkerIpcCommand) => {
    parentPort?.postMessage(await runWorkerCommand(command));
});

