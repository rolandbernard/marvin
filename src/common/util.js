
export function stringMatchQuality(query, text, regex) {
    if (typeof query === 'string' && typeof text === 'string') {
        if (!regex) {
            regex = generateSearchRegex(query);
        }
        const match = text.match(regex);
        if (match) {
            const best_match = match.reduce((a, b) => a.length < b.length ? a : b);
            const starts_with = text.toLowerCase().startsWith(best_match.toLowerCase());
            if (query.length === best_match.length) {
                if (starts_with) {
                    return 0.9 + 0.1 * (query.length / text.length);
                } else {
                    return 0.8 + 0.1 * (query.length / text.length);
                }
            } else {
                if (starts_with) {
                    return 0.2 + 0.5 * (query.length / best_match.length) + 0.1 * (query.length / text.length);
                } else {
                    return 0.1 + 0.6 * (query.length / best_match.length) + 0.1 * (query.length / text.length);
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
        'ig'
    );
}

function isObject(item) {
    return (item && typeof item === 'object');
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

export function cloneDeep(obj) {
    if (obj instanceof Array) {
        const ret = [];
        for (const key in obj) {
            ret[key] = cloneDeep(obj[key]);
        }
        return ret;
    } else if (isObject(obj)) {
        const ret = {};
        for (const key in obj) {
            ret[key] = cloneDeep(obj[key]);
        }
        return ret;
    } else {
        return obj;
    }
}
