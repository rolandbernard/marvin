
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

