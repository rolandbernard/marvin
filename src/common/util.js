
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
