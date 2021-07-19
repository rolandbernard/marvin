
declare module 'algebrite' {
    const algebrite: {
        float: (query: string) => { d?: number },
        eval: (query: string) => object,
        simplify: (query: string) => object,
        rationalize: (query: string) => object,
    };
    export default algebrite;
}

