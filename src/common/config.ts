
import { app } from 'electron';

import { Language } from 'common/local/locale';
import { time, Time, TimeUnit } from 'common/time';
import { Result } from 'common/result';
import { ModuleId, Module } from 'main/modules';

export type ConfigVersion = string;
export type ConfigShortcut = string;
export type ConfigColor = string;
export type ConfigPath = string;

export type ConfigSize = number;
export type ConfigQuality = number;
export type ConfigAmount = number;

export enum ConfigPrimitiveKind {
    STRING  = 'string',
    BOOLEAN = 'boolean',
    TIME    = 'time',
    SIZE    = 'size',
    AMOUNT  = 'amount',
    CODE    = 'code',
};

export class ConfigPrimitiveArrayKind {
    readonly base: ConfigPrimitiveKind;

    constructor(base: ConfigPrimitiveKind) {
        this.base = base;
    }
}

export class ConfigArrayKind {
    readonly value: Config;

    constructor(value: Config) {
        this.value = value;
    }
}

type ConfigKind = ConfigPrimitiveKind | ConfigArrayKind | ConfigDefinition;

export interface ConfigDefinition {
    [key: string]: ConfigKind;
}

export abstract class Config {
    readonly definition: ConfigDefinition = {};
}

export function configDef(type: ConfigKind) {
    return (target: Config, prop: string) => {
        target.definition[prop] = type;
    }
}

export class ModuleConfig extends Config {
    active: boolean;
    prefix: string;

    constructor(active?: boolean, prefix?: string) {
        super();
        this.active = active ?? false;
        this.prefix = prefix ?? '';
    }
};

export class GlobalConfig {
    version = app.getVersion();
    general = new class GeneralConfig {
        global_shortcut = 'Super+D';
        language = Language.English;
        debounce_time = time(20, TimeUnit.MILLISECONDS);
        width: ConfigSize = 600;
        max_height: ConfigSize = 500;
        max_results: ConfigAmount = 200;
        incremental_results = false;
        incremental_result_debounce: Time = time(20, TimeUnit.MILLISECONDS);
        smooth_scrolling = true;
        recenter_on_show = true;
        exclusive_module_prefix = true;
        enhanced_search = true;
    };
    theme = new class ThemeConfig {
        background_color_input: ConfigColor = 'black';
        background_color_output: ConfigColor = 'black';
        text_color_input: ConfigColor = 'white';
        text_color_output: ConfigColor = 'white';
        accent_color_input: ConfigColor = 'white';
        accent_color_output: ConfigColor = 'white';
        select_color: ConfigColor = 'grey';
        select_text_color: ConfigColor = 'white';
        border_radius: ConfigSize = 0;
        background_blur_input: ConfigSize = 0;
        background_blur_output: ConfigSize = 0;
        shadow_color_input: ConfigColor = '#00000000';
        shadow_color_output: ConfigColor = '#00000000';
    };
    modules: Record<ModuleId, Module<Result>>;

    constructor(modules: Record<ModuleId, Module<Result>>) {
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

