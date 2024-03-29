
export function match<Mapping>(value: keyof Mapping, mapping: Mapping): Mapping[keyof Mapping] {
    return mapping[value];
}

export function runMatch
<Mapping extends { [key: string]: () => any }>
(value: keyof Mapping, mapping: Mapping): ReturnType<Mapping[keyof Mapping]> {
    return match(value, mapping)?.();
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
                if (isObject(original) && isObject(replacement)) {
                    mergeDeep(original, replacement);
                } else if (!isObject(original)) {
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

export function isInEnum<Type extends string>(type: { [k: string]: Type }, value: any): value is Type {
    return Object.values<string>(type).includes(value);
}

export function copyCase(text: string, template: string): string {
    if (text.length < template.length) {
        return copyCase(text, template.substring(0, text.length));
    } else if (text.toLowerCase().startsWith(template.toLowerCase())) {
        const change = [...text.substring(0, template.length)];
        return change.map((ch, i) => {
            const temp = template.charAt(i);
            if (temp.toUpperCase() !== temp.toLowerCase()) {
                if (temp.toUpperCase() === temp) {
                    return ch.toUpperCase();
                } else {
                    return ch.toLowerCase();
                }
            } else {
                return ch;
            }
        }).join('') + text.substring(template.length);
    } else {
        return text;
    }
}

export type DeepIndex = (string | number)[];

export function indexObject(object: any, index: DeepIndex = []): any {
    if (index.length === 0) {
        return object;
    } else if (index[0] in object) {
        return indexObject(object[index[0]], index.slice(1));
    }
}

export function unique<Type, Key>(array: Type[], key: (elem: Type) => Key): Type[] {
    return array.filter((elem, index) => array.findIndex(e => key(e) === key(elem)) === index);
}

export interface Constructor<T> {
    new (): T;
}

export function fakeTemplateArray(array: String[]): TemplateStringsArray {
    const res = array as any;
    res.raw = res;
    return res;
}

