
import { ModuleId } from 'common/module';

export interface Preview {
    kind: string;
}

export interface FilePreview extends Preview {
    kind: 'file-preview';
    file: string;
}

export interface ColorPreview extends Preview {
    kind: 'color-preview';
    color: string;
}

export interface IFramePreview extends Preview {
    kind: 'iframe-preview';
    url: string;
}

export interface Result {
    kind: string;
    module: ModuleId;
    quality: number;
    preview?: Preview;
    file?: string;
}

export type Icon = {
    url?: string;
    material?: string;
};

export interface SimpleResult extends Result {
    kind: 'simple-result';
    icon: Icon;
    primary: string;
    secondary?: string;
}

export interface TextResult extends Result {
    kind: 'text-result';
    icon: Icon;
    text: string;
}

export interface HtmlResult extends Result {
    kind: 'html-result';
    html: string;
}

