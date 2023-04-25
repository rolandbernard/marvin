
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

    matchingRegex(text: string, map?: (c: string) => string, join = '') {
        return this.normalizeString(text.substring(0, MAX_MATCH_LENGTH))
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
                `(?=(${this.matchingRegex(this.text, ch => `(${ch})`, '(.*?)')}))`,
                'ig'
            );
        } else {
            this.regex = new RegExp(
                `((${this.matchingRegex(this.text)}))`,
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

    bestMatch(full_text: string): string | undefined {
        const text = full_text.substring(0, MAX_MATCH_LENGTH);
        let best: string | undefined;
        for (let match of text.matchAll(this.regex)) {
            if (!best || match[1].length < best.length) {
                best = match[1];
            }
        }
        return best;
    }

    matchText(text: string): number {
        if (text.length > 0 && this.text.length > 0) {
            let best_match = this.bestMatch(text);
            let value = 0.0;
            if (best_match) {
                best_match = this.normalizeString(best_match);
                if (this.text.length === best_match.length) {
                    value += 0.3;
                }
                value += 0.4 * this.text.length / best_match.length;
                value += 0.1 * this.text.length / text.length;
                if (text.toLowerCase().startsWith(best_match.toLowerCase())) {
                    value += 0.2;
                }
            }
            return value;
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
                    text.substring(0, text.indexOf(match)),
                    ...groups.slice(2),
                    text.substring(text.indexOf(match) + match.length),
                ];
            } else {
                return [text];
            }
        } else {
            return [text];
        }
    }

    matchAny(texts: string[], primary?: string): number {
        return Math.max(
            ...texts.map(text => this.matchText(text) * (primary ? 0.5 : 1)),
            this.matchText(primary ?? '')
        );
    }
}

