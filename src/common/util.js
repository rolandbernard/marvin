
export function stringMatchQuality(query, text, regex) {
    if (typeof query === 'string' && typeof text === 'string') {
        if (!regex) {
            regex = generateSearchRegex(query);
        }
        const match = text.match(regex);
        if (match) {
            return (query.length / text.length) * 1 / (1 + (match[0].length - query.length));
        } else {
            return 0.0;
        }
    } else {
        return 0.0;
    }
}

export function generateSearchRegex(query) {
    return new RegExp(query.split('').join('.*'), 'i');
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
