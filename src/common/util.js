
export function stringMatchQuality(text, pattern) {
    if (typeof text === "string" && typeof pattern === "string") {
        const text_upper = text.toUpperCase();
        const pattern_upper = pattern.toUpperCase();
        if (text_upper === pattern_upper) {
            return (text === pattern ? 1.0 : 0.9);
        } else if (pattern_upper.startsWith(text_upper)) {
            return 0.7 + 0.2 * (text_upper.length / pattern_upper.length);
        } else if (pattern_upper.includes(text_upper)) {
            return 0.5 + 0.4 * (text_upper.length / pattern_upper.length);
        } else {
            return 0;
        }
    } else {
        return 0;
    }
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
