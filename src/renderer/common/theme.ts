
import { styleMap } from 'lit-html/directives/style-map';

import { GlobalConfig } from 'common/config';

// Get the style map for custom properties for the given config
export function getConfigStyles(config?: GlobalConfig) {
    return styleMap({
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

        // General
        '--border-radius': config?.theme.border_radius.toString() ?? '0',
    });
}

