
import { config } from "../config";
import { clipboard } from 'electron';

function rgbToHsl(color) {
    const max = Math.max(...color);
    const min = Math.min(...color);
    const l = (max + min) / 2;
    let h, s;
    if (max != min) {
        if (l < 0.5) {
            s = (max - min) / (max + min);
        } else {
            s = (max - min) / (2.0 - max - min);
        }
        if (color[0] === max) {
            h = (color[1] - color[2]) / (max - min);
        } else if (color[1] === max) {
            h = 2.0 + (color[2] - color[0]) / (max - min);
        } else {
            h = 4.0 + (color[0] - color[1]) / (max - min);
        }
    }
    h = h / 6;
    while (h < 0) {
        h += 1;
    }
    return [h, s, l];
}

function hslToRgb([h, s, l]) {
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
    return [r, g, b];
}

function parseColor(query) {
    let match = false;
    if(match = query.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i)) {
        return [parseInt(match[1], 16) / 15, parseInt(match[2], 16) / 15, parseInt(match[3], 16) / 15];
    } else if(match = query.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)) {
        return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255];
    } else if(match = query.match(/^\s*rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*$/)) {
        return [parseInt(match[1]) / 255, parseInt(match[2]) / 255, parseInt(match[3]) / 255];
    } else if(match = query.match(/^\s*rgb\s*\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/)) {
        return [parseInt(match[1]) / 100, parseInt(match[2]) / 100, parseInt(match[3]) / 100];
    } else if(match = query.match(/^\s*hsl\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)\s*$/)) {
        return [parseInt(match[1]) / 360, parseInt(match[2]) / 100, parseInt(match[3]) / 100];
    } else {
        return false;
    }
}

function colorAsRgb(color) {
    return 'rgb(' + color.map(c => Math.round(c * 255)).join(', ') + ')';
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
    return 'hsl(' + Math.round(hsl[0] * 360) + ', '
        + Math.round(hsl[1] * 100) + '%, '
        + Math.round(hsl[2] * 100) + '%)';
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