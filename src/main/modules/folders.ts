
import { app } from 'electron';
import { readdir, stat } from 'fs/promises';
import { extname, dirname, join, basename, sep, relative, isAbsolute } from 'path';

import { config, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { FilePreview, SimpleResult } from 'common/result';
import { Module } from 'common/module';

import { module } from 'main/modules';
import { getDefaultPath, openFile } from 'main/adapters/file-handler';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'folders';

export function generateFilePreview(filename: string): FilePreview | undefined {
    if (extname(filename).match(/\.(pdf)/i)) {
        return {
            kind: 'embed-preview',
            file: `file://${filename}`,
        };
    } else if (extname(filename).match(/\.(a?png|avif|gif|jpe?g|jfif|pjp(eg)?|svg|webp|bmp|ico|cur)/i)) {
        return {
            kind: 'image-preview',
            file: `file://${filename}`,
        };
    } else if (extname(filename).match(/\.(mp4|webm|avi|ogv|ogm|ogg)/i)) {
        return {
            kind: 'video-preview',
            file: `file://${filename}`,
        };
    } else if (extname(filename).match(/\.(mp3|wav|mpeg)/i)) {
        return {
            kind: 'audio-preview',
            file: `file://${filename}`,
        };
    }
}

interface FoldersResult extends SimpleResult {
    module: typeof MODULE_ID;
    file: string;
}

class FoldersConfig extends ModuleConfig {
    @configKind('boolean')
    file_preview = false;

    @config({ kind: 'array', base: { kind: 'path', name: 'path' }, default: getDefaultPath() })
    directories = [ app.getPath('home'), getDefaultPath() ]

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class FoldersModule implements Module<FoldersResult> {
    readonly configs = FoldersConfig;

    get config() {
        return moduleConfig<FoldersConfig>(MODULE_ID);
    }

    async resultsFor(query: Query, self: string, rel?: string) {
        try {
            const parent = dirname(self);
            const files = [
                ...(await readdir(parent).catch(() => [])).map(file => join(parent, file)),
                ...(await readdir(self).catch(() => [])).map(file => join(self, file)),
            ];
            return (await Promise.all(files.map(async file => {
                try {
                    const stats = await stat(file);
                    const complete = rel ? relative(rel, file) : file;
                    return [{
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
                        autocomplete: `${this.config.prefix}${complete}${(stats.isDirectory() ? sep : '')}`,
                        file: file,
                        preview: this.config.file_preview ? generateFilePreview(file) : undefined,
                    } as FoldersResult];
                } catch (e) {
                    return [];
                }
            }))).flat();
        } catch (e) {
            return [];
        }
    }

    async search(query: Query): Promise<FoldersResult[]> {
        if (query.text.length > 0) {
            let absolute: FoldersResult[] = [];
            if (isAbsolute(query.text)) {
                absolute = await this.resultsFor(query, query.text);
            }
            return (await Promise.all(this.config.directories.map(async directory => {
                return this.resultsFor(query, join(directory, query.text), directory);
            }))).flat().concat(absolute);
        } else {
            return [];
        }
    }

    async rebuild(query: Query, result: FoldersResult): Promise<FoldersResult | undefined> {
        try {
            await stat(result.file);
            return {
                ...result,
                quality: query.matchText(result.file),
                preview: this.config.file_preview ? generateFilePreview(result.file) : undefined,
            };
        } catch (e) { /* Remove the result */ }
    }

    async execute(result: FoldersResult) {
        openFile(result.file);
    }
}

