
export type Color = [number, number, number, number?];

export function rgbToHsl([r, g, b, a]: Color): Color {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    if (max !== min) {
        if (l < 0.5) {
            s = (max - min) / (max + min);
        } else {
            s = (max - min) / (2.0 - max - min);
        }
        if (r === max) {
            h = (g - b) / (max - min);
        } else if (g === max) {
            h = 2.0 + (b - r) / (max - min);
        } else {
            h = 4.0 + (r - g) / (max - min);
        }
    }
    h = h / 6;
    while (h < 0) {
        h += 1;
    }
    return [h, s, l, a ?? 1];
}

export function hslToRgb([h, s, l, a]: Color): Color {
    let r = l;
    let g = l;
    let b = l;
    if (s !== 0) {
        function hueToRgb(p: number, q: number, t: number): number {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            } else if (t < 1 / 2) {
                return q;
            } else if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            } else {
                return p;
            }
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }
    return [r, g, b, a ?? 1];
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

