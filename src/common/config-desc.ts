
import { Config } from 'common/config';

export type ConfigDescription = ConfigType | ConfigArray | ConfigSelect | ConfigButton;

export enum ConfigType {
    BOOLEAN  = 'boolean',
    CODE     = 'code',
    COLOR    = 'color',
    OPTION   = 'option',
    PATH     = 'path',
    QUALITY  = 'quality',
    SHORTCUT = 'shortcut',
    SIZE     = 'size',
    TEXT     = 'text',
    TIME     = 'time',
    AMOUNT   = 'amount',

    PAGE     = 'page',
    PAGES    = 'page-list',
}

export interface ConfigList {
    [key: string]: ConfigDescription;
}

export class ConfigArray {
    readonly base: ConfigDescription | ConfigList;
    readonly value: unknown;

    constructor(value: unknown, base?: ConfigDescription) {
        this.value = value;
        if (value instanceof Config) {
            this.base = value.definition;
        } else if (base) {
            this.base = base;
        } else {
            throw new Error('Config description is required for non config base values');
        }
    }
}

export class ConfigSelect {
    readonly options: string[];

    constructor(options: string[]) {
        this.options = options;
    }
}

export class ConfigButton {
    readonly action: string;

    constructor(action: string) {
        this.action = action;
    }
}

