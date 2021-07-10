
export function match<Mapping>(value: keyof Mapping, mapping: Mapping): Mapping[keyof Mapping] {
    return mapping[value];
}

export function runMatch
<Mapping extends { [key: string]: () => any }>
(value: keyof Mapping, mapping: Mapping): ReturnType<Mapping[keyof Mapping]> {
    return match(value, mapping)();
}

