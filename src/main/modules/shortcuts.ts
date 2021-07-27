
import { globalShortcut } from 'electron';

import { Config, config, configKind, ModuleConfig } from 'common/config';
import { Result } from 'common/result';
import { Module } from 'common/module';

import { CommandMode, executeCommand } from 'main/adapters/commands';
import { module } from 'main/modules';
import { moduleConfig } from 'main/config';

const MODULE_ID = 'shortcuts';

class ShortcutEntry extends Config {
    @configKind('shortcut')
    shortcut = '';

    @configKind('code')
    script = '';

    @configKind('boolean')
    execute_in_terminal = false;
}

class ShortcutConfig extends ModuleConfig {
    @config({ kind: 'array', default: new ShortcutEntry() })
    shortcuts: ShortcutEntry[] = [];

    constructor() {
        super(false);
        this.removeConfigField('prefix');
    }
}

@module(MODULE_ID)
export class ShortcutModule implements Module<Result> {
    readonly configs = ShortcutConfig;

    shortcuts: string[] = [];

    get config() {
        return moduleConfig<ShortcutConfig>(MODULE_ID);
    }

    async init() {
        if (this.config.active) {
            for (const entry of this.config.shortcuts) {
                try {
                    globalShortcut.register(entry.shortcut, () => {
                        executeCommand(entry.script, entry.execute_in_terminal ? CommandMode.TERMINAL : CommandMode.SIMPLE);
                    });
                    this.shortcuts.push(entry.shortcut);
                } catch (e) { /* Ignore errors */ }
            }
        }
    }

    async update() {
        await this.deinit();
        await this.init();
    }

    async deinit() {
        for (const shortcut of this.shortcuts) {
            try {
                globalShortcut.unregister(shortcut);
            } catch (e) { /* Ignore errors */ }
        }
        this.shortcuts = [];
    }
}

