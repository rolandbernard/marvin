
export type Color = [number, number, number, number?];

export function rgbToHue([r, g, b]: Color): number {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const c = max - min;
    if (c === 0) {
        return 0;
    } else if (max === r) {
        return (g - b) / c / 6;
    } else if (max === g) {
        return (2 + (b - r) / c) / 6;
    } else {
        return (4 + (r - g) / c) / 6;
    }
}

export function rgbToHsl([r, g, b, a]: Color): Color {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const h = rgbToHue([r, g, b]);
    const s = max === min ? 0 : (max - l) / Math.min(l, 1 - l);
    return [h, s, l, a ?? 1];
}

export function rgbToHsv([r, g, b, a]: Color): Color {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const h = rgbToHue([r, g, b]);
    const s = (max - min) / max;
    return [h, s, max, a ?? 1];
}

export function hslToRgb([h, s, l, a]: Color): Color {
    function toRgb(n: number): number {
        const k = (n + 12 * h) % 12;
        const a = s * Math.min(l, 1 - l);
        return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    }
    return [toRgb(0), toRgb(8), toRgb(4), a ?? 1];
}

export function hsvToRgb([h, s, v, a]: Color): Color {
    function toRgb(n: number): number {
        const k = (n + 6 * h) % 6;
        return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    }
    return [toRgb(5), toRgb(3), toRgb(1), a ?? 1];
}

export function multiplyColor([a, b, c, d]: Color, [e, f, g, h]: Color): Color {
    return [a * e, b * f, c * g, (d ?? 1) * (h ?? 1)];
}

function parseValue(string: string, max = 1.0): number {
    if (string.endsWith('%')) {
        const value = parseFloat(string.substr(0, string.length - 1));
        return value / 100;
    } else {
        const value = parseFloat(string);
        return Math.min(value, max) / max;
    }
}

export function parseColor(query: string): Color {
    let match;
    if (match = query.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i)) {
        return match.slice(1).filter(v => v).map(v => parseInt(v, 16) / 15) as Color;
    } else if (match = query.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i)) {
        return match.slice(1).filter(v => v).map(v => parseInt(v, 16) / 255) as Color;
    } else if (match = query.match(/^\s*rgba?\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,?\s*(\d+\.?\d*%?)?\s*\)$/)) {
        return match.slice(1, 4).map(v => parseValue(v, 255)).concat(match[4] ? [parseValue(match[4])] : []) as Color;
    } else if (match = query.match(/^\s*hsla?\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,?\s*(\d+\.?\d*%?)?\s*\)$/)) {
        return hslToRgb([parseValue(match[1], 360), parseValue(match[2], 255), parseValue(match[3], 255)].concat(match[4] ? [parseValue(match[4])] : []) as Color);
    } else if (match = query.match(/^\s*hsva?\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,?\s*(\d+\.?\d*%?)?\s*\)$/)) {
        return hsvToRgb([parseValue(match[1], 360), parseValue(match[2], 255), parseValue(match[3], 255)].concat(match[4] ? [parseValue(match[4])] : []) as Color);
    } else {
        return [0, 0, 0, 0];
    }
}

export function colorAsRgb(color: Color): string {
    if (color[3]) {
        return `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${color[3]})`;
    } else {
        return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})`;
    }
}

export function colorAsHex(color: Color): string {
    function padString(str: string): string {
        if (str.length === 1) {
            return `0${str}`;
        } else {
            return str;
        }
    }
    return `#${color.map(c => padString(Math.round((c ?? 1) * 255).toString(16))).join('')}`;
}

export function colorAsHsl(color: Color): string {
    const hsl = rgbToHsl(color);
    if (hsl[3]) {
        return `hsla(${hsl[0] * 360}, ${hsl[1] * 100}%, ${hsl[2] * 100}%, ${hsl[3]})`;
    } else {
        return `hsl(${hsl[0] * 360}, ${hsl[1] * 100}%, ${hsl[2] * 100}%)`;
    }
}

export function colorAsHsv(color: Color): string {
    const hsv = rgbToHsv(color);
    if (hsv[3]) {
        return `hsva(${hsv[0] * 360}, ${hsv[1] * 100}%, ${hsv[2] * 100}%, ${hsv[3]})`;
    } else {
        return `hsv(${hsv[0] * 360}, ${hsv[1] * 100}%, ${hsv[2] * 100}%)`;
    }
}

