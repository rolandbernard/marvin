
import { app } from 'electron';
import { readdir, stat } from 'fs/promises';
import { extname, dirname, join, basename, sep, relative } from 'path';

import { config, configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { FilePreview, SimpleResult } from 'common/result';
import { match } from 'common/util';
import { Module } from 'common/module';
import { getPlatform } from 'common/platform';

import { module } from 'main/modules';
import { openFile } from 'main/adapters/file-handler';

const MODULE_ID = 'folders';

function generateFilePreview(filename: string): FilePreview | undefined {
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
    file: string;
}

const default_path = match(getPlatform(), {
    'linux': '/',
    'unsupported': '',
});

class FoldersConfig extends ModuleConfig {
    @configKind('boolean')
    file_preview = false;

    @config({ kind: 'array', base: { kind: 'path', name: 'path' }, default: default_path })
    directories = [ app.getPath('home'), default_path ]
}

@module(MODULE_ID)
export class FoldersModule implements Module<FoldersResult> {
    readonly config = new FoldersConfig(true);

    async search(query: Query): Promise<FoldersResult[]> {
        if (query.text.length > 0) {
            return (await Promise.all(this.config.directories.map(async directory => {
                try {
                    const parent = join(directory, dirname(query.text));
                    const self = join(directory, query.text);
                    const files = [
                        ...(await readdir(parent).catch(() => [])).map(file => join(parent, file)),
                        ...(await readdir(self).catch(() => [])).map(file => join(self, file)),
                    ];
                    return (await Promise.all(files.map(async file => {
                        try {
                            const stats = await stat(file);
                            return [{
                                module: MODULE_ID,
                                kind: 'simple-result',
                                query: query.text,
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
                            } as FoldersResult];
                        } catch (e) {
                            return [];
                        }
                    }))).flat();
                } catch (e) {
                    return [];
                }
            }))).flat();
        } else {
            return [];
        }
    }

    async execute(result: FoldersResult) {
        openFile(result.file);
    }
}
