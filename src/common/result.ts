
import { ModuleId } from 'common/module';

export abstract class Preview { }

export abstract class Result {
    readonly module: ModuleId;
    quality: number;
    preview?: Preview;

    constructor(module: ModuleId, quality: number, preview?: Preview) {
        this.module = module;
        this.quality = quality;
        this.preview = preview;
    }
}

export class SimpleResult extends Result {
    icon: string;
    primary: string;
    secondary?: string;

    constructor(module: ModuleId, quality: number, icon: string, primary: string, secondary?: string, preview?: Preview) {
        super(module, quality, preview);
        this.icon = icon;
        this.primary = primary;
        this.secondary = secondary;
    }
}

export class TextResult extends Result {
    icon: string;
    text: string;

    constructor(module: ModuleId, quality: number, icon: string, text: string, preview?: Preview) {
        super(module, quality, preview);
        this.icon = icon;
        this.text = text;
    }
}

export class HtmlResult extends Result {
    html: string;

    constructor(module: ModuleId, quality: number, html: string, preview?: Preview) {
        super(module, quality, preview);
        this.html = html;
    }
}

