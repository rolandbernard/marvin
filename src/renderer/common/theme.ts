
import { styleMap } from 'lit-html/directives/style-map';

import { GlobalConfig } from 'common/config';
import { parseColor, multiplyColor, colorAsHex } from 'common/color';

// Get the style map for custom properties for the given config
export function getConfigStyles(config?: GlobalConfig) {
    return styleMap({
        // General
        '--border-radius': config?.theme.border_radius.toString() ?? '0',

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
        '--settings-hover-background': colorAsHex(
            multiplyColor([1, 1, 1, 0.4], parseColor(config?.theme.settings.select_color ?? '#00000080'))
        ),
        '--settings-selection-background': config?.theme.settings.select_color ?? 'grey',
        '--settings-selection-text-color': config?.theme.settings.select_text_color ?? 'black',
        '--settings-active-color': config?.theme.settings.active_color ?? 'green',
        '--settings-inactive-color': colorAsHex(
            multiplyColor([1, 1, 1, 0.1], parseColor(config?.theme.settings.text_color ?? '#00000000'))
        ),
    });
}

