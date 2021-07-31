
import { app } from 'electron';
import { stat } from 'fs/promises';
import { basename, sep } from 'path';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { Platform } from 'common/platform';

import { module } from 'main/modules';
import { openFile } from 'main/adapters/file-handler';
import { generateFilePreview } from 'main/modules/folders';
import { moduleConfig } from 'main/config';
import { executeCommand } from 'main/adapters/commands';

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
        super(false);
    }
}

@module(MODULE_ID, Platform.LINUX)
export class LocateModule implements Module<LocateResult> {
    readonly configs = FoldersConfig;

    get config() {
        return moduleConfig<FoldersConfig>(MODULE_ID);
    }

    async searchFor(query: string): Promise<string[]> {
        const result = await executeCommand(`locate -i -l ${this.config.search_limit.toString()} -e ${query}`);
        return result?.stdout?.split('\n').filter(line => line) ?? [];
    }

    async itemForFile(query: Query, file: string): Promise<LocateResult> {
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
            autocomplete: this.config.prefix + file + (stats.isDirectory() ? sep : ''),
            file: file,
            preview: this.config.file_preview ? generateFilePreview(file) : undefined,
        };
    }

    async search(query: Query): Promise<LocateResult[]> {
        if (query.text.length > 0) {
            return (await Promise.all((await this.searchFor(query.text)).map(async file => {
                try {
                    return [await this.itemForFile(query, file)];
                } catch (e) {
                    return [];
                }
            }))).flat();
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: LocateResult): Promise<LocateResult | undefined> {
        try {
            return await this.itemForFile(query, result.file);
        } catch(e) { /* Remove the item */ }
    }

    async execute(result: LocateResult) {
        openFile(result.file);
    }
}

