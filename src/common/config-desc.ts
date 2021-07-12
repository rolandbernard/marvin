
import { Config } from "common/config";

// The config field description is used to generate the settings page
export type ConfigDescription = ConfigType | ConfigArray | ConfigSelect | ConfigButton | ConfigList;

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
    kind: 'list' | 'page' | 'subheader';
    values: Record<string, ConfigDescription>;
}

export interface ConfigArray {
    kind: 'array';
    base: ConfigDescription;
    value: any;
}

export function arrayConfig(value: Config): ConfigArray {
    return {
        kind: 'array',
        base: value.getDescription(),
        value: value,
    };
}

export interface ConfigSelect {
    kind: 'select';
    options: string[];
}

export interface ConfigButton {
    kind: 'button';
    action: string;
}

