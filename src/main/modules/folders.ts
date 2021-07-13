
import { app } from 'electron';
import { extname, dirname } from 'path';

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
                    // const dir = join(directory, dirname(query.text));
                    return {
                        module: MODULE_ID,
                        kind: 'simple-result',
                        quality: 1,
                        primary: 'tets',
                        file: 'test',
                    } as FoldersResult;
                } catch (e) {
                    return [];
                }
            }))).flat();
            // return (await Promise.all(config.modules.folders.directories.map(async (directory) => {
            //     try {
            //         await access(directory);
            //         const dir = join(directory, query_dir);
            //         const files = await readdir(dir);
            //         return (await Promise.all(files.map(async file => {
            //             const filepath = join(dir, file);
            //             const stats = await stat(filepath);
            //             return {
            //                 type: 'icon_list_item',
            //                 uri_icon: stats.isDirectory() ? null : (await app.getFileIcon(filepath)).toDataURL(),
            //                 material_icon: stats.isDirectory() ? 'folder' : null,
            //                 primary: file,
            //                 secondary: filepath,
            //                 executable: true,
            //                 complete: join(query_dir, file) + (stats.isDirectory() ? '/' : ''),
            //                 quality: base_query ? stringMatchQuality(base_query, file, regex) : 0.01,
            //                 file: join(dir, file),
            //                 preview: config.modules.folders.file_preview && generateFilePreview(filepath),
            //             };
            //         })));
            //     } catch (e) {
            //         return [];
            //     }
            // }))).filter(a => a).flat();
        } else {
            return [];
        }
    }

    async execute(result: FoldersResult) {
        openFile(result.file);
    }
}
