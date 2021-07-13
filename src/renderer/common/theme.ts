
import { styleMap } from 'lit-html/directives/style-map';

import { GlobalConfig } from 'common/config';

// Get the style map for custom properties for the given config
export function getConfigStyles(config?: GlobalConfig) {
    return styleMap({
        // Input field
        '--input-background': config?.theme.background_color_input ?? 'black',
        '--input-text-color': config?.theme.text_color_input ?? 'white',
        '--input-accent-color': config?.theme.accent_color_input ?? 'white',
        '--input-shadow-color': config?.theme.shadow_color_input ?? 'transparent',

        // Output field
        '--output-background': config?.theme.background_color_output ?? 'black',
        '--output-text-color': config?.theme.text_color_output ?? 'white',
        '--output-accent-color': config?.theme.accent_color_output ?? 'white',
        '--output-shadow-color': config?.theme.shadow_color_output ?? 'transparent',
        '--output-selection-background': config?.theme.select_color ?? 'grey',
        '--output-selection-text-color': config?.theme.select_text_color ?? 'white',

        // General
        '--border-radius': config?.theme.border_radius.toString() ?? '0',
    });
}

