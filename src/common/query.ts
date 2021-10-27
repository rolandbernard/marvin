
const MAX_MATCH_LENGTH = 200;

export class Query {
    readonly advanced: boolean;
    readonly raw: string;
    readonly text: string;
    readonly regex: RegExp;

    normalizeString(text: string): string {
        return text.normalize('NFKD')
            .replace(/[\u0300-\u036F]/g, '')
            .replace(/\s+/g, ' ');
    }

    escapeRegex(text: string, map?: (c: string) => string, join = '') {
        return this.normalizeString(text.substr(0, MAX_MATCH_LENGTH))
            .split('').map((ch) => {
            // Escape special regex characters
            if ([
                '\\', '.', '*', '+', '[', ']', '(', ')', '{', '}',
            '^', '$', '?', '|',
            ].includes(ch)) {
                return '\\' + ch;
            } else {
                return ch;
            }
        }).map(map ?? (ch => ch)).join(join);
    }

    constructor(raw: string, text: string, advanced: boolean) {
        this.raw = raw;
        this.advanced = advanced;
        this.text = text.trim();
        if (this.advanced) {
            this.regex = new RegExp(
                `(?=(${this.escapeRegex(this.text, ch => `(${ch})`, '(.*?)')}))`,
                'ig'
            );
        } else {
            this.regex = new RegExp(
                `((${this.escapeRegex(this.text)}))`,
                'i'
            );
        }
    }

    withoutPrefix(prefix: string) {
        if (prefix.length > 0 && this.text.startsWith(prefix)) {
            return new Query(this.raw, this.text.replace(prefix, ''), this.advanced);
        } else {
            return this;
        }
    }

    bestMatch(text: string): string | undefined {
        text = text.substr(0, MAX_MATCH_LENGTH);
        let best: string | undefined;
        for (let match of text.matchAll(this.regex)) {
            if (!best || match[1].length < best.length) {
                best = match[1];
            }
        }
        return best;
    }

    matchText(full_text: string): number {
        const text = full_text.substr(0, MAX_MATCH_LENGTH);
        if (text.length > 0 && this.text.length > 0) {
            const best_match = this.bestMatch(text);
            if (best_match) {
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
        } else {
            return 0.0;
        }
    }

    matchGroups(text: string): string[] {
        if (text.length > 0 && this.text.length > 0) {
            const match = this.bestMatch(text);
            if (match && match.length !== 0) {
                const groups = this.regex.exec(match)!;
                return [
                    text.substr(0, text.indexOf(match)),
                    ...groups.slice(2),
                    text.substr(text.indexOf(match) + match.length),
                ];
            } else {
                return [ text ];
            }
        } else {
            return [ text ];
        }
    }

    matchAny(texts: string[], primary?: string): number {
        return Math.max(
            ...texts.map(text => this.matchText(text) * (primary ? 0.5 : 1)),
            this.matchText(primary ?? '')
        );
    }
}

