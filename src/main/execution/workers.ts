
import { Worker } from 'worker_threads';
import { join } from 'path';

import { ModuleId } from 'common/module';

import { WorkerIpcCommand, WorkerIpcResponse, WorkerData } from 'main/execution/worker-ipc'

const worker_pool: Record<ModuleId, Worker> = {};

interface WorkerWaitingRequest {
    id: number;
    res: (res: WorkerIpcResponse) => undefined;
    rej: () => undefined;
}

const worker_waits: Record<ModuleId, WorkerWaitingRequest[]> = {};

export function executeForModule(module: ModuleId, cmd: WorkerIpcCommand): Promise<WorkerIpcResponse> {
    return new Promise((res, rej) => {
        if (!(module in worker_pool)) {
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
                const idx = worker_waits[module].findIndex(w => w.id = res.id);
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
        worker_pool[module].postMessage(cmd);
        rej();
    });
}

