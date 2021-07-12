
import { ModuleId } from 'common/module';

export abstract class Preview { }

export interface Result {
    kind: string;
    module: ModuleId;
    quality: number;
    preview?: Preview;
}

export interface SimpleResult extends Result {
    kind: 'simple-result';
    icon: string;
    primary: string;
    secondary?: string;
}

export interface TextResult extends Result {
    kind: 'text-result';
    icon: string;
    text: string;
}

export interface HtmlResult extends Result {
    kind: 'html-result';
    html: string;
}

