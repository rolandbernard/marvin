
import { Translatable } from 'common/local/locale';
import { Platform } from 'common/platform';
import { DeepIndex } from 'common/util';
import { IpcChannels } from 'common/ipc';

interface BaseConfig {
    kind: string;
    name?: Translatable;
    disabled?: {
        index: DeepIndex;
        compare: boolean;
    }
    icon?: string;
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
    options: Translatable[];
}

export interface SelectActionConfig extends BaseConfig {
    kind: 'select-action';
    placeholder: Translatable;
    options: Translatable[];
    action: IpcChannels;
}

export interface ButtonConfig extends BaseConfig {
    kind: 'button';
    action: IpcChannels;
    confirm: boolean;
}

export type ConfigDescription = SimpleConfig | ObjectConfig | ArrayConfig | SelectConfig | SelectActionConfig | ButtonConfig;

