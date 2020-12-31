
import { config } from "../config";
import { clipboard } from 'electron';

function rgbToHsl([r, g, b, a]) {
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
    if (a) {
        return [h, s, l, a];
    } else {
        return [h, s, l];
    }
}

function hslToRgb([h, s, l, a]) {
    let r = l;
    let g = l;
    let b = l;
    if (s !== 0) {
        function hueToRgb(p, q, t) {
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
    if (a) {
        return [r, g, b, a];
    } else {
        return [r, g, b];
    }
}

function parseValue(string, max = 1.0) {
    if (string.endsWith('%')) {
        const value = parseFloat(string.substr(0, string.length - 1));
        return value / 100;
    } else {
        const value = parseFloat(string);
        return Math.min(value, max) / max;
    }
}

function parseColor(query) {
    let match = false;
    if(match = query.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i)) {
        return match.slice(1).filter(v => v).map(v => parseInt(v, 16) / 15);
    } else if(match = query.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i)) {
        return match.slice(1).filter(v => v).map(v => parseInt(v, 16) / 255);
    } else if(match = query.match(/^\s*rgba?\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,?\s*(\d+\.?\d*%?)?\s*\)$/)) {
        return match.slice(1, 4).map(v => parseValue(v, 255)).concat(match[4] ? [parseValue(match[4])] : []);
    } else if(match = query.match(/^\s*hsla?\s*\(\s*(\d+%?)\s*,\s*(\d+%?)\s*,\s*(\d+%?)\s*,?\s*(\d+\.?\d*%?)?\s*\)$/)) {
        return hslToRgb([parseValue(match[1], 360), parseValue(match[2], 255), parseValue(match[3], 255)].concat(match[4] ? [parseValue(match[4])] : []));
    } else {
        return false;
    }
}

function colorAsRgb(color) {
    if (color.length == 4) {
        return 'rgba(' + color.slice(0, 3).map(c => Math.round(c * 255)).join(', ') + ', ' + Math.round(color[3] * 100) / 100 + ')';
    } else {
        return 'rgb(' + color.map(c => Math.round(c * 255)).join(', ') + ')';
    }
}

function colorAsHex(color) {
    function padString(str) {
        if(str.length === 1) {
            return '0' + str;
        } else {
            return str;
        }
    }
    return '#' + color.map(c => padString(Math.round(c * 255).toString(16))).join('');
}

function colorAsHsl(color) {
    const hsl = rgbToHsl(color);
    if (color.length == 4) {
        return 'hsla(' + Math.round(hsl[0] * 360) + ', '
            + Math.round(hsl[1] * 100) + '%, '
            + Math.round(hsl[2] * 100) + '%, '
            + Math.round(hsl[3] * 100) / 100 + ')';
    } else {
        return 'hsl(' + Math.round(hsl[0] * 360) + ', '
            + Math.round(hsl[1] * 100) + '%, '
            + Math.round(hsl[2] * 100) + '%)';
    }
}

const ColorModule = {
    valid: (query) => {
        return parseColor(query);
    },
    search: async (query) => {
        const color = parseColor(query);
        return [
            {
                type: 'icon_list_item',
                material_icon: 'palette',
                primary: colorAsRgb(color),
                quality: config.modules.color.quality,
                executable: true,
                preview: config.modules.color.color_preview && {
                    type: 'color',
                    color: colorAsHex(color),
                },
            },
            {
                type: 'icon_list_item',
                material_icon: 'palette',
                primary: colorAsHsl(color),
                quality: config.modules.color.quality,
                executable: true,
                preview: config.modules.color.color_preview && {
                    type: 'color',
                    color: colorAsHex(color),
                },
            },
            {
                type: 'icon_list_item',
                material_icon: 'palette',
                primary: colorAsHex(color),
                quality: config.modules.color.quality,
                executable: true,
                preview: config.modules.color.color_preview && {
                    type: 'color',
                    color: colorAsHex(color),
                },
            },
        ];
    },
    execute: async (option) => {
        clipboard.writeText(option.primary.trim());
    },
}

export default ColorModule;