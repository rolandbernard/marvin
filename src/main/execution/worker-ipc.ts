
import { ModuleId } from 'common/module';
import { Result } from 'common/result';
import { GlobalConfig } from 'common/config';

interface WorkerIpcBaseCommand {
    kind: string;
    id: number;
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

export type WorkerIpcCommand =
    WorkerIpcSimpleCommand | WorkerIpcConfigCommand | WorkerIpcQueryCommand
    | WorkerIpcRebuildCommand | WorkerIpcExecuteCommand;

interface WorkerIpcBaseResponse {
    kind: string;
    id: number;
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

