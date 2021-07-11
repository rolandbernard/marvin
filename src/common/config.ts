
import { app } from 'electron';

import { Language } from 'common/local/locale';
import { time, TimeUnit } from 'common/time';
import { Result } from 'common/result';
import { ModuleId, Module } from 'common/module';
import { ConfigDescription, ConfigList, ConfigSelect, ConfigType } from 'common/config-desc';

const def_meta_symbol = Symbol();

export abstract class Config {
    [def_meta_symbol]: ConfigList;

    get definition() {
        if (!this[def_meta_symbol]) {
            this[def_meta_symbol] = {};
        }
        return this[def_meta_symbol];
    }
}

export function config(type: ConfigDescription) {
    return (target: Config, prop: string) => {
        target.definition[prop] = type;
    }
}

export class ModuleConfig extends Config {
    @config(ConfigType.BOOLEAN)
    active: boolean;

    @config(ConfigType.TEXT)
    prefix: string;

    constructor(active?: boolean, prefix?: string) {
        super();
        this.active = active ?? false;
        this.prefix = prefix ?? '';
    }
};

class GeneralConfig extends Config {
    @config(ConfigType.SHORTCUT)
    global_shortcut = 'Super+D';

    @config(new ConfigSelect(Object.values(Language)))
    language = Language.English;

    @config(ConfigType.TIME)
    debounce_time = time(20, TimeUnit.MILLISECONDS);

    @config(ConfigType.SIZE)
    width = 600;

    @config(ConfigType.SIZE)
    max_height = 500;

    @config(ConfigType.AMOUNT)
    max_results = 200;

    @config(ConfigType.BOOLEAN)
    incremental_results = false;

    @config(ConfigType.TIME)
    incremental_result_debounce = time(20, TimeUnit.MILLISECONDS);

    @config(ConfigType.BOOLEAN)
    smooth_scrolling = true;

    @config(ConfigType.BOOLEAN)
    recenter_on_show = true;

    @config(ConfigType.BOOLEAN)
    exclusive_module_prefix = true;

    @config(ConfigType.BOOLEAN)
    enhanced_search = true;
}

class ThemeConfig extends Config {
    @config(ConfigType.COLOR)
    background_color_input = 'black';

    @config(ConfigType.COLOR)
    background_color_output = 'black';

    @config(ConfigType.COLOR)
    text_color_input = 'white';

    @config(ConfigType.COLOR)
    text_color_output = 'white';

    @config(ConfigType.COLOR)
    accent_color_input = 'white';

    @config(ConfigType.COLOR)
    accent_color_output = 'white';

    @config(ConfigType.COLOR)
    select_color = 'grey';

    @config(ConfigType.COLOR)
    select_text_color = 'white';

    @config(ConfigType.SIZE)
    border_radius = 0;

    @config(ConfigType.COLOR)
    shadow_color_input = '#00000000';

    @config(ConfigType.COLOR)
    shadow_color_output = '#00000000';
}

export class GlobalConfig extends Config {
    version = app.getVersion();

    @config(ConfigType.PAGE)
    general = new GeneralConfig();

    @config(ConfigType.PAGE)
    theme = new ThemeConfig();

    @config(ConfigType.PAGES)
    modules: Record<ModuleId, Module<Result>>;

    constructor(modules: Record<ModuleId, Module<Result>>) {
        super();
        this.modules = Object.assign({},
            ...Object.keys(modules).sort()
                .map(module => ({ module, config: modules[module].config }))
                .filter(({ config }) => config)
                .map(({ module, config }) => ({
                    [module]: config,
                }))
        );
    }
};

