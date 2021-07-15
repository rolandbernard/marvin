
export class Query {
    readonly advanced: boolean;
    readonly text: string;
    readonly regex: RegExp;

    constructor(text: string, advanced: boolean) {
        this.advanced = advanced;
        this.text = text.trim();
        if (this.advanced) {
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
                }).map(ch => `(${ch})`).join('(.*?)'),
                'ig'
            );
        } else {
            this.regex = new RegExp(
                `(${this.text.split('').map((ch) => {
                    // Escape special regex characters
                    if ([
                        '\\', '.', '*', '+', '[', ']', '(', ')', '{', '}',
                        '^', '$', '?', '|',
                    ].includes(ch)) {
                        return '\\' + ch;
                    } else {
                        return ch;
                    }
                }).join('')})`,
                'i'
            );
        }
    }

    withoutPrefix(prefix: string) {
        if (this.text.startsWith(prefix)) {
            return new Query(this.text.replace(prefix, ''), this.advanced);
        } else {
            return this;
        }
    }

    matchText(text: string): number {
        const match = text.match(this.regex);
        if (match) {
            const best_match = match.reduce((a, b) => a.length <= b.length ? a : b);
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

    matchGroups(text: string): string[] {
        const match = text.match(this.regex);
        if (match) {
            const best_match = match.reduce((a, b) => a.length <= b.length ? a : b);
            if (best_match.length !== 0) {
                const groups = this.regex.exec(best_match)!;
                groups[0] = text.substr(0, text.indexOf(best_match));
                groups.push(text.substr(text.indexOf(best_match) + best_match.length));
                return groups;
            } else {
                return [ text ];
            }
        } else {
            return [ text ];
        }
    }

    matchAny(texts: string[], primary?: string): number {
        return Math.max(
            ...texts.map(text => this.matchText(text)),
            this.matchText(primary ?? '')
        );
    }
}

