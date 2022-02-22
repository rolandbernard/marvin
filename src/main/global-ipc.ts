
import { Socket, createServer, createConnection } from 'net';
import { rm } from 'fs/promises'

import { getSocketPath } from 'main/adapters/file-handler';

const connections: Set<Socket> = new Set();

interface GlobalIpcBaseCommand {
    kind: string;
}

export interface GlobalIpcSimpleCommand extends GlobalIpcBaseCommand {
    kind: 'show' | 'toggle' | 'hide' | 'settings' | 'quit';
    args?: string[];
}

export type GlobalIpcCommand = GlobalIpcSimpleCommand;

export function initGlobalIpc(handler: (cmd: GlobalIpcCommand) => unknown): Promise<void> {
    return new Promise(async (res, rej) => {
        const path = getSocketPath();
        try {
            await rm(path, { force: true });
        } catch (e) { /* Ignore errors */ }
        const server = createServer(socket => {
            connections.add(socket);
            socket.on('end', () => {
                connections.delete(socket);
            });
            socket.on('data', msg => {
                const cmd: GlobalIpcCommand = JSON.parse(msg.toString());
                handler(cmd);
                socket.end();
            });
        });
        server.on('listening', res);
        server.on('error', rej);
        server.listen(path);
    });
}

export function sendGlobalIpc(cmd: GlobalIpcCommand): Promise<void> {
    return new Promise((res, rej) => {
        const client = createConnection(getSocketPath());
        client.on('connect', () => {
            client.write(Buffer.from(JSON.stringify(cmd)), () => {
                res();
            });
        });
        client.on('error', rej);
    });
}

