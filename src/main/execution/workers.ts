
import { join } from 'path';

import { ModuleId } from 'common/module';
import { Result } from 'common/result';
import { Query } from 'common/query';

import { config } from 'main/config';
import { WorkerIpcCommand, WorkerIpcResponse, runWorkerCommand } from 'main/execution/worker-ipc'

function executeForModule(module: ModuleId, cmd: WorkerIpcCommand): Promise<WorkerIpcResponse> {
    return new Promise((res, rej) => {
        runWorkerCommand(module, cmd)
            .then(res)
            .catch(rej);
    });
}

export async function initModule(module: ModuleId) {
    await executeForModule(module, {
        kind: 'init',
        config: config,
    });
}

export async function updateModule(module: ModuleId) {
    await executeForModule(module, {
        kind: 'update',
        config: config,
    });
}

export async function deinitModule(module: ModuleId) {
    await executeForModule(module, { kind: 'deinit' });
}

export async function searchModule(module: ModuleId, query: Query) {
    const res = await executeForModule(module, {
        kind: 'search',
        query: {
            text: query.text,
            raw: query.raw,
            advanced: query.advanced,
        },
    });
    if (res.kind === 'results') {
        return res.results;
    }
}

export async function refreshModule(module: ModuleId) {
    await executeForModule(module, { kind: 'refresh' });
}

export async function rebuildModule(module: ModuleId, query: Query, result: Result) {
    const res = await executeForModule(module, {
        kind: 'rebuild',
        query: {
            text: query.text,
            raw: query.raw,
            advanced: query.advanced,
        },
        result: result,
    });
    if (res.kind === 'result') {
        return res.result;
    }
}

export async function executeModule(module: ModuleId, result: Result) {
    await executeForModule(module, {
        kind: 'execute',
        result: result,
    });
}

export async function executeAnyModule(module: ModuleId, result: Result) {
    await executeForModule(module, {
        kind: 'execute-any',
        result: result,
    });
}

export async function invokeModule(module: ModuleId, method: string) {
    await executeForModule(module, {
        kind: 'call',
        method: method,
    });
}

