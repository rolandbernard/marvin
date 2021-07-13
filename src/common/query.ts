
import { GlobalConfig } from 'common/config';

export class Query {
    readonly text: string;
    readonly regex: RegExp;

    constructor(config: GlobalConfig, text: string) {
        this.text = text.trim();
        if (config.general.enhanced_search) {
            this.regex = new RegExp(
                this.text.split('').map((ch) => {
                    // Escape special regex characters
                    if ([
                        '\\', '.', '*', '+', '[', ']', '(', ')', '{', '}',
                        '^', '$', '?', '|',
                    ].includes(ch)) {
                        return '\\' + ch;
                    } else {
                        return ch;
                    }
                }).join('.*?'),
                'ig'
            );
        } else {
            this.regex = new RegExp(
                this.text.split('').map((ch) => {
                    // Escape special regex characters
                    if ([
                        '\\', '.', '*', '+', '[', ']', '(', ')', '{', '}',
                    '^', '$', '?', '|',
                    ].includes(ch)) {
                        return '\\' + ch;
                    } else {
                        return ch;
                    }
                }).join(''),
                'i'
            );
        }
    }

    withoutPrefix(config: GlobalConfig, prefix: string) {
        if (this.text.startsWith(prefix)) {
            return new Query(config, this.text.replace(prefix, ''));
        } else {
            return this;
        }
    }

    matchText(text: string): number {
        const match = text.match(this.regex);
        if (match) {
            const best_match = match.reduce((a, b) => a.length < b.length ? a : b);
            const starts_with = text.toLowerCase().startsWith(best_match.toLowerCase());
            if (this.text.length === best_match.length) {
                if (starts_with) {
                    return 0.9 + 0.1 * (this.text.length / text.length);
                } else {
                    return 0.8 + 0.1 * (this.text.length / text.length);
                }
            } else {
                if (starts_with) {
                    return 0.2 + 0.5 * (this.text.length / best_match.length) + 0.1 * (this.text.length / text.length);
                } else {
                    return 0.1 + 0.6 * (this.text.length / best_match.length) + 0.1 * (this.text.length / text.length);
                }
            }
        } else {
            return 0.0;
        }
    }

    matchAny(texts: string[], primary?: string): number {
        return Math.max(
            ...texts.map(text => this.matchText(text)),
            this.matchText(primary ?? '')
        );
    }
}

