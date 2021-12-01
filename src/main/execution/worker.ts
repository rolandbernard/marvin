
import { workerData, parentPort } from 'worker_threads';

import { WorkerIpcCommand, WorkerData, runWorkerCommand } from 'main/execution/worker-ipc'

const worker_data: WorkerData = workerData;

parentPort?.on('message', async (command: WorkerIpcCommand) => {
    parentPort?.postMessage(await runWorkerCommand(worker_data.module, command));
});

