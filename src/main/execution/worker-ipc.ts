
import { Query } from 'common/query';
import { ModuleId } from 'common/module';
import { Result } from 'common/result';
import { GlobalConfig } from 'common/config';

import { moduleForId } from 'main/modules';
import { updateConfig } from 'main/config';

interface WorkerIpcBaseCommand {
    kind: string;
    id?: number;
}

interface WorkerIpcSimpleCommand extends WorkerIpcBaseCommand {
    kind: 'deinit' | 'refresh';
}

interface WorkerIpcConfigCommand extends WorkerIpcBaseCommand {
    kind: 'init' | 'update';
    config: GlobalConfig;
}

interface WorkerIpcQueryCommand extends WorkerIpcBaseCommand {
    kind: 'search';
    query: {
        text: string,
        raw: string,
        advanced: boolean,
    };
}

interface WorkerIpcRebuildCommand extends WorkerIpcBaseCommand {
    kind: 'rebuild';
    query: {
        text: string,
        raw: string,
        advanced: boolean,
    };
    result: Result;
}

interface WorkerIpcExecuteCommand extends WorkerIpcBaseCommand {
    kind: 'execute' | 'execute-any';
    result: Result;
}

interface WorkerIpcMethodCommand extends WorkerIpcBaseCommand {
    kind: 'call';
    method: string;
}

export type WorkerIpcCommand =
    WorkerIpcSimpleCommand | WorkerIpcConfigCommand | WorkerIpcQueryCommand
    | WorkerIpcRebuildCommand | WorkerIpcExecuteCommand | WorkerIpcMethodCommand;

interface WorkerIpcBaseResponse {
    kind: string;
    id?: number;
}

interface WorkerIpcVoidResponse extends WorkerIpcBaseResponse {
    kind: 'error' | 'void';
}

interface WorkerIpcResultsResponse extends WorkerIpcBaseResponse {
    kind: 'results';
    results?: Result[];
}

interface WorkerIpcResultResponse extends WorkerIpcBaseResponse {
    kind: 'result';
    result?: Result;
}

export type WorkerIpcResponse =
    WorkerIpcVoidResponse | WorkerIpcResultsResponse | WorkerIpcResultResponse;

export interface WorkerData {
    module: ModuleId;
}

export async function runWorkerCommand(module: ModuleId, command: WorkerIpcCommand): Promise<WorkerIpcResponse> {
    let result: WorkerIpcResponse;
    try {
        switch (command.kind) {
            case 'init': {
                await updateConfig(command.config);
                await moduleForId(module)?.init?.();
                result = { kind: 'void' };
                break;
            }
            case 'update': {
                await updateConfig(command.config);
                await moduleForId(module)?.update?.();
                result = { kind: 'void' };
                break;
            }
            case 'deinit': {
                await moduleForId(module)?.deinit?.();
                result = { kind: 'void' };
                break;
            }
            case 'refresh': {
                await moduleForId(module)?.refresh?.();
                result = { kind: 'void' };
                break;
            }
            case 'search': {
                const query = new Query(command.query.raw, command.query.text, command.query.advanced);
                const res = await moduleForId(module)?.search?.(query);
                result = { kind: 'results', results: res };
                break;
            }
            case 'rebuild': {
                const query = new Query(command.query.raw, command.query.text, command.query.advanced);
                const res = await moduleForId(module)?.rebuild?.(query, command.result);
                result = { kind: 'result', result: res };
                break;
            }
            case 'execute': {
                await moduleForId(module)?.execute?.(command.result);
                result = { kind: 'void' };
                break;
            }
            case 'execute-any': {
                await moduleForId(module)?.executeAny?.(command.result);
                result = { kind: 'void' };
                break;
            }
            case 'call': {
                await (moduleForId(module) as any)?.[command.method]?.();
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

