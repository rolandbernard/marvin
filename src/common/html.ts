
export interface HtmlTag {
    tag: string;
    attributes: Record<string, string>;
    content: HtmlElement[];
}

export type HtmlElement = HtmlTag | string;

const TAG_REGEX = /<!--.*?-->|<\s*?([-\w]+)([^>]*?)>|<\/\s*?([-\w]+)>|([^<]+)/g;
const ATTR_REGEX = /([-\w]+)(=('[^']*'|"[^"]*"))?/g;

const SINGLETON_TAGS = [
    'area', 'base', 'br',
    'col', 'command', 'embed',
    'hr', 'img', 'input',
    'keygen', 'link', 'meta',
    'param', 'source', 'track',
    'wbr',
];

export function parseHtml(text: string): HtmlElement {
    const stack: HtmlTag[] = [
        {
            tag: ':root',
            attributes: {},
            content: [],
        },
    ];
    let match: RegExpExecArray | null;
    while (match = TAG_REGEX.exec(text)) {
        if (match[1]) {
            // Opening tag with classes
            const tag = match[1].toLowerCase();
            const attributes: Record<string, string> = {};
            let attr_match: RegExpExecArray | null;
            while (attr_match = ATTR_REGEX.exec(match[2])) {
                const value = attr_match[3] ?? '""';
                attributes[attr_match[1]] = value.substr(1, value.length - 2);
            }
            const value = {
                tag: tag,
                attributes: attributes,
                content: [ ],
            };
            stack[stack.length - 1].content.push(value);
            if (!SINGLETON_TAGS.includes(tag)) {
                stack.push(value);
            }
        } else if (match[3]) {
            // Closing tag with classes
            const tag = match[3].toLowerCase();
            if (stack.length > 1 && stack[stack.length - 1].tag === tag) {
                stack.pop();
            }
        } else if (match[4]) {
            // Text
            stack[stack.length - 1].content.push(match[4]);
        }
    }
    return stack[0];
}

const ESCAPE_CODES: Record<string, string> = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'copy': '©',
    'frac14': '¼',
    'frac12': '½',
    'frac34': '¾',
};

function escapeHtmlCodes(text: string): string {
    return text.replace(/&(#x?(\d+)|\w+);/g, (text, name: string, digit: string) => {
        if (digit) {
            return String.fromCodePoint(parseInt(digit, name[1] === 'x' ? 16 : 10));
        } else if (name in ESCAPE_CODES) {
            return ESCAPE_CODES[name];
        } else {
            return text;
        }
    });
}

export function innerText(element: HtmlElement = '', trim = false, escape = false): string {
    if (escape) {
        return escapeHtmlCodes(innerText(element, trim));
    } else if (trim) {
        return innerText(element).replace(/\s+/g, ' ').trim();
    } else if (typeof element === 'string') {
        return element;
    } else {
        return element.content.map(elem => innerText(elem)).join('');
    }
}

function matchesSelectors(element: HtmlElement, query: string[]): boolean {
    if (typeof element === 'string') {
        return false;
    } else {
        return !query.some(selector => {
            let match: RegExpMatchArray | null;
            if (selector === '*') {
                return false;
            } else if (match = selector.match(/\[\s*([-\w]+)\s*(([~|^$*]?=)\s*("[^"]*"|'[^']*'))?\s*\]/)) {
                if (match[2]) {
                    const value = match[4].substr(1, match[4].length - 2);
                    if (match[3] === '=') {
                        return element.attributes[match[1]] !== value;
                    } else if (match[3] === '~=') {
                        return !element.attributes[match[1]]?.split(/\s+/)?.includes(value);
                    } else if (match[3] === '|=') {
                        return element.attributes[match[1]] !== value
                            && !element.attributes[match[1]]?.startsWith(`${value}-`);
                    } else if (match[3] === '^=') {
                        return !element.attributes[match[1]]?.startsWith(value);
                    } else if (match[3] === '$=') {
                        return !element.attributes[match[1]]?.endsWith(value);
                    } else if (match[3] === '*=') {
                        return !element.attributes[match[1]]?.includes(value);
                    }
                } else {
                    return !(match[1] in element.attributes);
                }
            } else if (selector[0] === '#') {
                return element.attributes['id'] !== selector.substr(1);
            } else if (selector[0] === '.') {
                return !element.attributes['class']?.split(/\s+/)?.includes(selector.substr(1));
            } else {
                return selector !== element.tag;
            }
        });
    }
}

function selectAllHelper(element: HtmlElement, query: string[][][]): HtmlTag[] {
    if (typeof element === 'string') {
        return [];
    } else {
        const result: HtmlTag[] = [];
        if (query.some(option => matchesSelectors(element, option[0]) && option.length === 1)) {
            result.push(element);
        }
        query = query.map(option => {
            if (matchesSelectors(element, option[0]) && option.length !== 1) {
                return option.slice(1);
            } else {
                return option;
            }
        });
        for (const elem of element.content) {
            result.push(...selectAllHelper(elem, query));
        }
        return result;
    }
}

const SELECTOR_MATCH = /(\*|\[[-\w]+([~|^$*]?=("[^"]*"|'[^']*'))?\]|#[-\w]+|\.[-\w]+|[-\w]+)/g;

export function selectAll(element: HtmlElement, query: string): HtmlTag[] {
    const selector = query
        .split(/\s*,\s*/)
        .map(option =>
            option.split(/\s+/)
                .map(elem => elem.match(SELECTOR_MATCH)!)
                .filter(elem => elem)
        )
        .filter(option => option.length > 0);
    return selectAllHelper(element, selector);
}

