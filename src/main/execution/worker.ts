
import { workerData, parentPort } from 'worker_threads';

import { Query } from 'common/query';
import { ModuleId } from 'common/module';

import { moduleForId } from 'main/modules';
import { updateConfig } from 'main/config';
import { WorkerIpcCommand, WorkerIpcResponse, WorkerData } from 'main/execution/worker-ipc'

const worker_data: WorkerData = workerData;
const module_id: ModuleId = worker_data.module;

parentPort?.on('message', async (command: WorkerIpcCommand) => {
    let result: WorkerIpcResponse;
    try {
        switch (command.kind) {
            case 'init': {
                await updateConfig(command.config);
                await moduleForId(module_id)?.init?.();
                result = { kind: 'void', id: command.id };
                break;
            }
            case 'update': {
                await updateConfig(command.config);
                await moduleForId(module_id)?.update?.();
                result = { kind: 'void', id: command.id };
                break;
            }
            case 'deinit': {
                await moduleForId(module_id)?.deinit?.();
                result = { kind: 'void', id: command.id };
                break;
            }
            case 'refresh': {
                await moduleForId(module_id)?.refresh?.();
                result = { kind: 'void', id: command.id };
                break;
            }
            case 'search': {
                const query = new Query(command.query.raw, command.query.text, command.query.advanced);
                const res = await moduleForId(module_id)?.search?.(query);
                result = { kind: 'results', id: command.id, results: res };
                break;
            }
            case 'rebuild': {
                const query = new Query(command.query.raw, command.query.text, command.query.advanced);
                const res = await moduleForId(module_id)?.rebuild?.(query, command.result);
                result = { kind: 'result', id: command.id, result: res };
                break;
            }
            case 'execute': {
                await moduleForId(module_id)?.execute?.(command.result);
                result = { kind: 'void', id: command.id };
                break;
            }
            case 'execute-any': {
                await moduleForId(module_id)?.executeAny?.(command.result);
                result = { kind: 'void', id: command.id };
                break;
            }
        }
    } catch (e) {
        result = {
            kind: 'error',
            id: command.id,
        };
    }
    parentPort?.postMessage(result);
});

