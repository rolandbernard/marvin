
export function match<Mapping>(value: keyof Mapping, mapping: Mapping): Mapping[keyof Mapping] {
    return mapping[value];
}

export function runMatch
<Mapping extends { [key: string]: () => any }>
(value: keyof Mapping, mapping: Mapping): ReturnType<Mapping[keyof Mapping]> {
    return match(value, mapping)();
}

export function importAll(context: __WebpackModuleApi.RequireContext) {
    context.keys().forEach(context);
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target: any, ...sources: any[]): any {
    if (sources.length === 0) {
        return target;
    } else {
        const source = sources.shift();
        if (isObject(target) && isObject(source)) {
            for (const key in source) {
                const original = target[key];
                const replacement = source[key];
                if (isObject(replacement) && isObject(original)) {
                    mergeDeep(original, replacement);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return mergeDeep(target, ...sources);
    }
}

export function cloneDeep<Type>(obj: Type): Type {
    if (obj instanceof Array) {
        const ret: unknown[] = [];
        for (const key in obj) {
            ret[key] = cloneDeep(obj[key]);
        }
        return ret as any;
    } else if (isObject(obj)) {
        const ret: any = {};
        for (const key in obj) {
            ret[key] = cloneDeep(obj[key]);
        }
        return ret;
    } else {
        return obj;
    }
}

export function isInEnum<Type extends string>(type: { [k: string]: Type }, value: string): value is Type {
    return Object.values<string>(type).includes(value);
}

