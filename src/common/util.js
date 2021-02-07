
export function stringMatchQuality(query, text, regex) {
    if (typeof query === 'string' && typeof text === 'string') {
        if (!regex) {
            regex = generateSearchRegex(query);
        }
        const match = text.match(regex);
        if (match) {
            const starts_with = text.toLowerCase().startsWith(match[0].toLowerCase());
            if (query.length === match[0].length) {
                if (starts_with) {
                    // starts with
                    return 0.9 + 0.1 * (query.length / text.length);
                } else {
                    // includes
                    return 0.8 + 0.1 * (query.length / text.length);
                }
            } else {
                if (starts_with) {
                    // starts with similar
                    return 0.1 + 0.6 * (query.length / match[0].length) + 0.1 * (query.length / text.length);
                } else {
                    // includes similar
                    return 0.7 * (query.length / match[0].length) + 0.1 * (query.length / text.length);
                }
            }
        } else {
            return 0.0;
        }
    } else {
        return 0.0;
    }
}

export function generateSearchRegex(query) {
    return new RegExp(
        query.split('').map((ch) => {
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
        'i'
    );
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}
