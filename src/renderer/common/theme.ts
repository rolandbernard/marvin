
import { styleMap } from 'lit-html/directives/style-map';

import { GlobalConfig } from 'common/config';
import { parseColor, multiplyColor, colorAsHex } from 'common/color';

// Get the style map for custom properties for the given config
export function getConfigStyles(config?: GlobalConfig) {
    return styleMap({
        // General
        '--border-radius': (config?.theme.border_radius.toString() ?? '0') + 'px',

        // Input field
        '--input-background': config?.theme.input.background_color ?? 'black',
        '--input-text-color': config?.theme.input.text_color ?? 'white',
        '--input-accent-color': config?.theme.input.accent_color ?? 'white',
        '--input-shadow-color': config?.theme.input.shadow_color ?? 'transparent',

        // Output field
        '--output-background': config?.theme.output.background_color ?? 'black',
        '--output-text-color': config?.theme.output.text_color ?? 'white',
        '--output-accent-color': config?.theme.output.accent_color ?? 'white',
        '--output-shadow-color': config?.theme.output.shadow_color ?? 'transparent',
        '--output-selection-background': config?.theme.output.select_color ?? 'grey',
        '--output-selection-text-color': config?.theme.output.select_text_color ?? 'white',

        // Settings field
        '--settings-background': config?.theme.settings.background_color ?? 'white',
        '--settings-text-color': config?.theme.settings.text_color ?? 'black',
        '--settings-accent-color': config?.theme.settings.accent_color ?? 'black',
        '--settings-shadow-color': config?.theme.settings.shadow_color ?? '#00000080',
        '--settings-selection-background': config?.theme.settings.select_color ?? 'grey',
        '--settings-selection-text-color': config?.theme.settings.select_text_color ?? 'black',
        '--settings-active-color': config?.theme.settings.active_color ?? 'green',
        '--settings-dark-background': colorAsHex(
            multiplyColor([0.98, 0.98, 0.98], parseColor(config?.theme.settings.background_color ?? '#ffffff'))
        ),
        '--settings-transparent-background': colorAsHex(
            multiplyColor([0.99, 0.99, 0.99, 0.8], parseColor(config?.theme.settings.background_color ?? '#ffffff'))
        ),
        '--settings-light-active-color': colorAsHex(
            multiplyColor([1, 1, 1, 0.4], parseColor(config?.theme.settings.active_color ?? '#00ff00'))
        ),
        '--settings-hover-background': colorAsHex(
            multiplyColor([1, 1, 1, 0.5], parseColor(config?.theme.settings.select_color ?? '#00000080'))
        ),
        '--settings-inactive-color': colorAsHex(
            multiplyColor([1, 1, 1, 0.1], parseColor(config?.theme.settings.text_color ?? '#00000000'))
        ),
        '--settings-border-color': colorAsHex(
            multiplyColor([1, 1, 1, 0.2], parseColor(config?.theme.settings.text_color ?? '#00000000'))
        ),
        '--settings-border-hover-color': colorAsHex(
            multiplyColor([1, 1, 1, 0.4], parseColor(config?.theme.settings.text_color ?? '#00000000'))
        ),
    });
}

