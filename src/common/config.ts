
import { app } from 'electron';

import { Language, Translatable } from 'common/local/locale';
import { time, TimeUnit } from 'common/time';
import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module';
import { ConfigDescription, ObjectConfig, SimpleConfig } from 'common/config-desc';

const desc_meta = Symbol();

export abstract class Config {
    [desc_meta]: ObjectConfig;

    get description(): ObjectConfig {
        if (!this[desc_meta]) {
            this[desc_meta] = {
                kind: 'object',
                options: [],
            };
        }
        return this[desc_meta];
    }

    getDescription(): ObjectConfig {
        for (const entry of this.description.options!) {
            if (entry.kind === 'page' || entry.kind === 'object') {
                const transformed: ObjectConfig = (this as any)[entry.name!].getDescription();
                entry.options = transformed?.options;
            } else if (entry.kind === 'pages') {
                entry.options = [];
                const pages = (this as any)[entry.name!];
                for (const page in pages) {
                    const transformed: ObjectConfig = pages[page].getDescription();
                    transformed.name = page as Translatable;
                    transformed.kind = 'page';
                    entry.options.push(transformed);
                }
            } else if (entry.kind === 'array') {
                if (entry.default instanceof Config) {
                    entry.base = entry.default.getDescription();
                }
            }
        }
        return this.description;
    }
}

export function config(details: ConfigDescription) {
    return (target: Config, prop: Translatable) => {
        target.description.options!.push({
            name: prop,
            ...details,
        });
    }
}

export function configKind(details: (SimpleConfig | ObjectConfig)['kind']) {
    return (target: Config, prop: Translatable) => {
        target.description.options!.push({
            kind: details,
            name: prop,
        });
    }
}

export class ModuleConfig extends Config {
    @configKind('boolean')
    active: boolean;

    @configKind('text')
    prefix: string;

    constructor(active?: boolean, prefix?: string) {
        super();
        this.active = active ?? false;
        this.prefix = prefix ?? '';
    }
};

class GeneralConfig extends Config {
    @configKind('shortcut')
    global_shortcut = 'Alt+Space';

    @config({ kind: 'select', options: Object.values(Language) })
    language = Language.English;

    @configKind('time')
    debounce_time = time(20, TimeUnit.MILLISECONDS);

    @configKind('size')
    width = 600;

    @configKind('size')
    max_height = 500;

    @configKind('amount')
    max_results = 200;

    @configKind('boolean')
    incremental_results = false;

    @config({ kind: 'time', enabled: 'general.incremental_results' })
    incremental_result_debounce = time(20, TimeUnit.MILLISECONDS);

    @configKind('boolean')
    smooth_scrolling = true;

    @configKind('boolean')
    recenter_on_show = true;

    @configKind('boolean')
    exclusive_module_prefix = true;

    @configKind('boolean')
    enhanced_search = true;
}

class InputThemeConfig extends Config {
    @configKind('color')
    background_color = 'black';

    @configKind('color')
    text_color = 'white';

    @configKind('color')
    accent_color = 'white';

    @configKind('color')
    shadow_color = '#00000000';
}

class OutputThemeConfig extends Config {
    @configKind('color')
    background_color = 'black';

    @configKind('color')
    text_color = 'white';

    @configKind('color')
    accent_color = 'white';

    @configKind('color')
    select_color = '#303030';

    @configKind('color')
    select_text_color = 'white';

    @configKind('color')
    shadow_color = '#00000000';
}

class ThemeConfig extends Config {
    @configKind('size')
    border_radius = 0;

    @configKind('object')
    input = new InputThemeConfig();

    @configKind('object')
    output = new OutputThemeConfig();
}

export class GlobalConfig extends Config {
    readonly version = app.getVersion();

    @configKind('page')
    general = new GeneralConfig();

    @configKind('page')
    theme = new ThemeConfig();

    @configKind('pages')
    modules: Record<ModuleId, ModuleConfig | undefined>;

    constructor(modules: Record<ModuleId, Module<Result>>) {
        super();
        this.modules = Object.assign({},
            ...Object.keys(modules).sort()
                .map(module => ({ module, config: modules[module as Translatable].config }))
                .filter(({ config }) => config)
                .map(({ module, config }) => ({
                    [module]: config,
                }))
        );
    }
};

