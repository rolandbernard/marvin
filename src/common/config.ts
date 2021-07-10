
import { app } from 'electron';

import { Language } from 'common/local/locale';
import { time, Time, TimeUnit } from 'common/time';
import {ModuleId, MODULES} from 'main/modules';

export type ConfigVersion = string;
export type ConfigShortcut = string;
export type ConfigColor = string;
export type ConfigPath = string;

export type ConfigSize = number;
export type ConfigQuality = number;
export type ConfigAmount = number;

export class ModuleConfig {
    active: boolean;
    prefix: string;

    constructor(active?: boolean, prefix?: string) {
        this.active = active ?? false;
        this.prefix = prefix ?? '';
    }
};

export class Config {
    version: ConfigVersion = app.getVersion();
    general = new class GeneralConfig {
        global_shortcut: ConfigShortcut = 'Super+D';
        language = Language.English;
        debounce_time: Time = time(20, TimeUnit.MILLISECONDS);
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
    modules = {
        system_commands: MODULES.system_commands.config,
    };
        // {
        // linux_system = new class LinuxSystemConfig extends ModuleConfig {} (true);
        // folders = new class FoldersConfig extends ModuleConfig {
        //     file_preview = false;
        //     directories: ConfigPath[] = ['/', app.getPath('home')];
        // } (true);
        // html = new class HtmlConfig extends ModuleConfig {
        //     entries: {
        //         name: string;
        //         html: string;
        //         default_quality: ConfigQuality;
        //     }[] = [];
        // } (false);
        // calculator = new class CalculatorConfig extends ModuleConfig {
        //     quality: ConfigQuality = 1.0;
        //     backend: 'mathjs' | 'algebrite' | 'mathjs_algebrite' = 'mathjs';
        // } (true);
        // linux_applications = new class LinuxApplicationConfig extends ModuleConfig {
        //     directories: ConfigPath[] = [
        //         '/usr/share/applications/',
        //         join(app.getPath('home'), '.local/share/applications/')
        //     ];
        //     refresh_interval_min: Time = time(30, TimeUnit.MINUTE);
        // } (true);
        // url: {
        //     active: true;
        //     prefix: '';
        //     quality: 1.0;
        //     url_preview: false;
        // };
        // locate: {
        //     active: false;
        //     prefix: '';
        //     search_limit: 1000;
        //     file_preview: false;
        // };
        // shortcuts: {
        //     active: false;
        //     prefix: '';
        //     shortcuts: [];
        // };
        // command: {
        //     active: true;
        //     prefix: '$';
        //     quality: 1.0;
        // };
        // scripts: {
        //     active: false;
        //     prefix: '';
        //     entries: [];
        // };
        // clipboard: {
        //     active: false;
        //     prefix: '';
        //     refresh_time: 20;
        //     maximum_history: 1000;
        // };
        // deepl: {
        //     active: false;
        //     prefix: '';
        //     quality: 1.0;
        // };
        // linux_windows: {
        //     active: false;
        //     prefix: '';
        // };
        // duckduckgo: {
        //     active: false;
        //     prefix: '';
        //     debounce_time: 500;
        //     quality: 0.1;
        //     url_preview: false;
        // };
        // history: {
        //     active: false;
        //     searchable: true;
        //     prefix: '';
        //     quality: 0.1;
        //     maximum_history: 1000;
        //     sort_by_frequency: false;
        //     weight_by_frequency: false;
        // };
        // color: {
        //     active: false;
        //     prefix: '';
        //     quality: 1;
        //     color_preview: false;
        // };
        // web_search: {
        //     active: false;
        //     prefix: '';
        //     patterns: [
        //         { prefix: 'd?'; url_pattern: 'https://duckduckgo.com/?q=$' };
        //         { prefix: 'g?'; url_pattern: 'https://www.google.com/search?q=$' };
        //         { prefix: 'b?'; url_pattern: 'https://www.bing.com/search?q=$' };
        //         { prefix: 'w?'; url_pattern: 'https://en.wikipedia.org/wiki/Special:Search?search=$' };
        //         { prefix: 's?'; url_pattern: 'https://stackoverflow.com/search?q=$' };
        //     ];
        //     url_preview: false;
        //     quality: 1.0;
        // };
        // alias: {
        //     active: false;
        //     prefix: '';
        //     aliases: [];
        //     prefix_text: true;
        // };
        // currency_converter: {
        //     active: false;
        //     prefix: '';
        //     refresh_interval_min: 60;
        //     quality: 1.0;
        // };
        // dictionary: {
        //     active: false;
        //     prefix: 'dict?';
        //     debounce_time: 500;
        //     quality: 1.0;
        // };
        // bookmarks: {
        //     active: false;
        //     prefix: '';
        //     url_preview: false;
        // };
        // email: {
        //     active: false;
        //     prefix: '';
        //     quality: 1.0;
        // };
    // };
};

