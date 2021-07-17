
import { ModuleId } from 'common/module';

interface BasePreview {
    kind: string;
}

export interface FilePreview extends BasePreview {
    kind: 'embed-preview' | 'image-preview' | 'video-preview' | 'audio-preview';
    file: string;
}

export interface ColorPreview extends BasePreview {
    kind: 'color-preview';
    color: string;
}

export interface IFramePreview extends BasePreview {
    kind: 'iframe-preview';
    url: string;
}

export type Preview = FilePreview | ColorPreview | IFramePreview;

interface BaseResult {
    kind: string;
    module: ModuleId;
    query: string;
    quality: number;
    preview?: Preview;
    file?: string;
    autocomplete?: string;
}

export type Icon = {
    url?: string;
    material?: string;
};

export interface SimpleResult extends BaseResult {
    kind: 'simple-result';
    icon?: Icon;
    primary: string;
    secondary?: string;
}

export interface TextResult extends BaseResult {
    kind: 'text-result';
    icon?: Icon;
    text: string;
}

export interface HtmlResult extends BaseResult {
    kind: 'html-result';
    html: string;
}

export type Result = SimpleResult | TextResult | HtmlResult;

