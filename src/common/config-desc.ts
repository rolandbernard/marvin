
import { Translatable } from 'common/local/locale';
import { Platform } from 'common/platform';
import { DeepIndex } from 'common/util';

interface BaseConfig {
    kind: string;
    name?: Translatable;
    enabled?: DeepIndex;
    icon?: string;
    tooltip?: string;
    platform?: Platform | Platform[];
}

export interface SimpleConfig extends BaseConfig {
    kind: 'boolean' | 'code' | 'color' | 'result' | 'path' | 'quality'
        | 'shortcut' | 'size' | 'text' | 'time' | 'amount';
}

export interface ObjectConfig extends BaseConfig {
    kind: 'object' | 'page' | 'pages';
    options?: ConfigDescription[];
}

export interface ArrayConfig extends BaseConfig {
    kind: 'array';
    base?: ConfigDescription;
    default: any;
}

export interface SelectConfig extends BaseConfig {
    kind: 'select';
    options: string[];
}

export interface ButtonConfig extends BaseConfig {
    kind: 'button';
    action: string;
    confirm: boolean;
}

export type ConfigDescription = SimpleConfig | ObjectConfig | ArrayConfig | SelectConfig | ButtonConfig;

