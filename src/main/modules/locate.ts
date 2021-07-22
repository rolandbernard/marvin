
import { app } from 'electron';
import { stat } from 'fs/promises';
import { spawn } from 'child_process';
import { dirname, basename, sep, relative } from 'path';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { Platform } from 'common/platform';

import { module } from 'main/modules';
import { openFile } from 'main/adapters/file-handler';
import { generateFilePreview } from 'main/modules/folders';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'locate';

interface LocateResult extends SimpleResult {
    module: typeof MODULE_ID;
    file: string;
}

class FoldersConfig extends ModuleConfig {
    @configKind('boolean')
    file_preview = false;

    @configKind('amount')
    search_limit = 1000;

    constructor() {
        super(true);
    }
}

@module(MODULE_ID, Platform.LINUX)
export class LocateModule implements Module<LocateResult> {
    readonly configs = FoldersConfig;

    get config() {
        return moduleConfig<FoldersConfig>(MODULE_ID);
    }

    searchFor(query: string): Promise<string[]> {
        return new Promise<string[]>((res, rej) => {
            try {
                const child = spawn('locate', ['-i', '-l', this.config.search_limit.toString(), '-e', query]);
                const results: string[] = [];
                child.on('exit', () => res(results));
                child.on('error', rej);
                let last = '';
                child.stdout.setEncoding('utf8');
                child.stdout.on('data', (chunk: string) => {
                    const split = (last + chunk).split('\n');
                    if (split.length > 0) {
                        last = split.pop()!;
                        for (const file of split) {
                            results.push(file);
                        }
                    }
                });
            } catch (e) {
                rej(e);
            }
        });
    }

    async search(query: Query): Promise<LocateResult[]> {
        if (query.text.length > 0) {
            return await Promise.all((await this.searchFor(query.text)).map(async file => {
                const directory = dirname(file);
                const stats = await stat(file);
                return {
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: {
                        url: stats.isDirectory() ? undefined : (await app.getFileIcon(file)).toDataURL(),
                        material: stats.isDirectory() ? 'folder' : 'insert_drive_file',
                    },
                    primary: basename(file),
                    secondary: file,
                    quality: query.matchText(file),
                    autocomplete: relative(directory, file) + (stats.isDirectory() ? sep : ''),
                    file: file,
                    preview: this.config.file_preview ? generateFilePreview(file) : undefined,
                } as LocateResult;
            }));
        } else {
            return [];
        }
    }

    async execute(result: LocateResult) {
        openFile(result.file);
    }
}

