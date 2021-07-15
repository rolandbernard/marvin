
import { app } from 'electron';

import { Language, Translatable } from 'common/local/locale';
import { time, TimeUnit } from 'common/time';
import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module';
import { ConfigDescription, ObjectConfig, SimpleConfig } from 'common/config-desc';
import { cloneDeep } from 'common/util';

const desc_meta = Symbol();

export abstract class Config {
    static [desc_meta] = new WeakMap<Config, ConfigDescription[]>();

    copyFromPrototype() {
        if (!Config[desc_meta].has(this)) {
            Config[desc_meta].set(this, []);
            const super_desc = Config[desc_meta].get(Object.getPrototypeOf(this));
            super_desc?.forEach(this.addConfigField.bind(this));
        }
    }

    constructor() {
        this.copyFromPrototype();
    }

    addConfigField(desc: ConfigDescription) {
        // This will be called by a decorator, so the constructor will not have run yet.
        this.copyFromPrototype();
        Config[desc_meta].get(this)?.push(desc);
    }

    getDescription(): ObjectConfig {
        const description = {
            kind: 'object' as 'object',
            options: cloneDeep(Config[desc_meta].get(this)) ?? [],
        };
        for (const entry of description.options) {
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
                entry.options.sort((a, b) => a.name!.localeCompare(b.name!));
            } else if (entry.kind === 'array') {
                if (entry.default instanceof Config) {
                    entry.base = entry.default.getDescription();
                }
            }
        }
        return description;
    }
}

export function config(details: ConfigDescription) {
    return (target: Config, prop: Translatable) => {
        target.addConfigField({
            name: prop,
            ...details,
        });
    }
}

export function configKind(details: (SimpleConfig | ObjectConfig)['kind']) {
    return config({ kind: details });
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

    @config({ kind: 'time', enabled: ['general', 'incremental_results'] })
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

