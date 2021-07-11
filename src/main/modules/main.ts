
import { BrowserWindow, Tray } from 'electron';

import { GlobalConfig } from 'common/config';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';

import { module } from 'main/modules';

const MODULE_ID = 'main';

@module(MODULE_ID)
export class MainModule implements Module<SimpleResult> {
    tray?: Tray;
    window?: BrowserWindow;

    async init(config: GlobalConfig) {
    }

    async deinit(config: GlobalConfig) {
    }
}

