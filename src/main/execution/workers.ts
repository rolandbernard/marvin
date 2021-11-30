
import { Worker } from 'worker_threads';
import { join } from 'path';

import { ModuleId } from 'common/module';
import { Result } from 'common/result';
import { Query } from 'common/query';

import { config } from 'main/config';
import { moduleForId } from 'main/modules';
import { WorkerIpcCommand, WorkerIpcResponse, WorkerData } from 'main/execution/worker-ipc'

const worker_pool: Record<ModuleId, Worker> = {};

interface WorkerWaitingRequest {
    id: number;
    res: (res: WorkerIpcResponse) => unknown;
    rej: () => unknown;
}

const worker_waits: Record<ModuleId, WorkerWaitingRequest[]> = {};

let next_id = 0;

function createModuleWorker(module: ModuleId) {
    const worker_data: WorkerData = {
        module: module,
    };
    const worker = new Worker(join(__dirname, 'worker.js'), {
        workerData: worker_data,
    });
    worker_waits[module] = [];
    worker_pool[module] = worker;
    worker.addListener('exit', () => {
        delete worker_pool[module];
        for (const w of worker_waits[module]) {
            w.rej();
        }
        delete worker_waits[module];
    });
    worker.addListener('message', (res: WorkerIpcResponse) => {
        const idx = worker_waits[module].findIndex(w => w.id === res.id);
        if (idx !== -1) {
            const wait = worker_waits[module][idx];
            worker_waits[module].splice(idx, 1);
            if (res.kind === 'error') {
                wait.rej();
            } else {
                wait.res(res);
            }
        }
    });
}

function executeForModule(module: ModuleId, cmd: WorkerIpcCommand): Promise<WorkerIpcResponse> {
    return new Promise(async (res, rej) => {
        if (!(module in worker_pool)) {
            createModuleWorker(module);
        }
        cmd.id = next_id;
        worker_waits[module].push({
            id: next_id,
            res: res,
            rej: rej,
        });
        next_id++;
        worker_pool[module].postMessage(cmd);
        rej();
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
    const res = await executeForModule(module, {
        kind: 'execute',
        result: result,
    });
    if (res.kind === 'result') {
        return res.result;
    }
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

