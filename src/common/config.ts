
import { app } from 'electron';

import { Language, Translatable } from 'common/local/locale';
import { time, TimeUnit } from 'common/time';
import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module';
import { ConfigDescription, ObjectConfig, SimpleConfig } from 'common/config-desc';
import { cloneDeep } from 'common/util';
import { getPlatform } from 'common/platform';

const config_desc = new WeakMap<Config, ConfigDescription[]>();

export abstract class Config {

    copyFromPrototype() {
        Object.getPrototypeOf(this).copyFromPrototype?.();
        if (!config_desc.has(this)) {
            config_desc.set(this, []);
            const super_desc = config_desc.get(Object.getPrototypeOf(this));
            super_desc?.forEach(this.addConfigField.bind(this));
        }
    }

    constructor() {
        this.copyFromPrototype();
    }

    addConfigField(desc: ConfigDescription) {
        // This will be called by a decorator, so the constructor will not have run yet.
        this.copyFromPrototype();
        config_desc.get(this)?.push(desc);
    }

    removeConfigField(name: string) {
        // This will be called by a decorator, so the constructor will not have run yet.
        this.copyFromPrototype();
        const desc = config_desc.get(this);
        if (desc) {
            const index = desc.findIndex(desc => desc.name === name);
            if (index >= 0) {
                desc.splice(index, 1);
            }
        }
    }

    getDescription(): ObjectConfig {
        const description = {
            kind: 'object' as 'object',
            options: cloneDeep(config_desc.get(this)) ?? [],
        };
        for (const entry of description.options) {
            if (entry.kind === 'page' || entry.kind === 'object') {
                const transformed: ObjectConfig = (this as any)[entry.name!]?.getDescription?.();
                entry.options = transformed?.options;
            } else if (entry.kind === 'pages') {
                entry.options = [];
                const pages = (this as any)[entry.name!];
                for (const page in pages) {
                    const transformed: ObjectConfig = pages[page]?.getDescription?.();
                    if (transformed) {
                        transformed.name = page as Translatable;
                        transformed.kind = 'page';
                        entry.options.push(transformed);
                    }
                }
                entry.options.sort((a, b) => a.name!.localeCompare(b.name!));
            }
        }
        return description;
    }
}

export function config(details: ConfigDescription) {
    return (target: Config, prop: Translatable) => {
        if (
            !details.platform
            || details.platform === getPlatform()
            || details.platform.includes?.(getPlatform())
        ) {
            if (details.kind === 'array' && !details.base && details.default instanceof Config) {
                details.base = details.default.getDescription();
            }
            target.addConfigField({
                name: prop,
                ...details,
            });
        }
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
    incremental_results = true;

    @config({ kind: 'time', disabled: { index: ['general', 'incremental_results'], compare: false } })
    incremental_result_debounce = time(20, TimeUnit.MILLISECONDS);

    @configKind('boolean')
    smooth_scrolling = true;

    @configKind('boolean')
    recenter_on_show = true;

    @configKind('boolean')
    exclusive_module_prefix = true;

    @configKind('boolean')
    enhanced_search = true;

    constructor() {
        super();
        this.addConfigField({
            kind: 'button',
            name: 'reset_config',
            action: 'reset-config',
            confirm: true,
        });
    }
}

class InputThemeConfig extends Config {
    @configKind('color')
    background_color = '#000000';

    @configKind('color')
    text_color = '#ffffff';

    @configKind('color')
    accent_color = '#ffffff';

    @configKind('color')
    shadow_color = '#00000000';
}

class OutputThemeConfig extends Config {
    @configKind('color')
    background_color = '#000000';

    @configKind('color')
    text_color = '#ffffff';

    @configKind('color')
    accent_color = '#ffffff';

    @configKind('color')
    select_color = '#303030';

    @configKind('color')
    select_text_color = '#ffffff';

    @configKind('color')
    shadow_color = '#00000000';
}

class SettingsThemeConfig extends Config {
    @configKind('color')
    background_color = '#ffffff';

    @configKind('color')
    text_color = '#000000';

    @configKind('color')
    accent_color = '#505050';

    @configKind('color')
    select_color = '#e0e0e0';

    @configKind('color')
    select_text_color = '#000000';

    @configKind('color')
    active_color = '#539b26';

    @configKind('color')
    shadow_color = '#00000080';
}

class ThemeConfig extends Config {
    @configKind('size')
    border_radius = 0;

    @configKind('object')
    input = new InputThemeConfig();

    @configKind('object')
    output = new OutputThemeConfig();

    @configKind('object')
    settings = new SettingsThemeConfig();
}

export class GlobalConfig extends Config {
    readonly version = app.getVersion();
    readonly platform = getPlatform();

    @config({ kind: 'page', icon: 'settings' })
    general = new GeneralConfig();

    @config({ kind: 'page', icon: 'palette' })
    theme = new ThemeConfig();

    @configKind('pages')
    modules: Record<ModuleId, ModuleConfig | undefined>;

    constructor(modules: Record<ModuleId, Module<Result>>) {
        super();
        this.modules = Object.assign({},
            ...Object.keys(modules).sort()
                .map(module => ({ module, config: modules[module as Translatable].configs }))
                .filter(({ config }) => config)
                .map(({ module, config }) => ({
                    [module]: new config!(),
                }))
        );
    }
};

