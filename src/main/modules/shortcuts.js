
import { config } from "../config";
import { globalShortcut } from "electron";
import { exec } from 'child_process';

const ShortcutModule = {
    init: async () => {
        if (config.modules.shortcuts.active) {
            config.modules.shortcuts.shortcuts.forEach((shortcut) => {
                try {
                    globalShortcut.register(shortcut.shortcut, () => {
                        exec(`sh <<< '${shortcut.script.replace(/\'/g, "'\\''")}'`);
                    });
                } catch (e) { }
            });
        }
    },
    update: async (old_config) => {
        old_config.modules.shortcuts.shortcuts.forEach((shortcut) => {
            try {
                globalShortcut.unregister(shortcut.shortcut);
            } catch (e) { }
        });
        await ShortcutModule.init();
    },
    deinit: async () => {
        config.modules.shortcuts.shortcuts.forEach((shortcut) => {
            try {
                globalShortcut.unregister(shortcut.shortcut);
            } catch (e) { }
        });
    },
    valid: (query) => {
        return false;
    },
}

export default ShortcutModule;
