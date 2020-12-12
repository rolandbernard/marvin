
const config_definition = [
    { name: 'general', icon: 'settings', options: [
        { name: 'global_shortcut', type: 'shortcut' },
        { name: 'language', type: 'language' },
        { name: 'debounce_time', type: 'size' },
        { name: 'width', type: 'size' },
        { name: 'max_height', type: 'size' },
        { name: 'max_results', type: 'size' },
        { name: 'incremental_results', type: 'boolean' },
        { name: 'smooth_scrolling', type: 'boolean' },
        { name: 'recenter_on_show', type: 'boolean' },
    ], type: 'page' },
    { name: 'theme', icon: 'palette', options: [
        { name: 'background_color_input', type: 'color' },
        { name: 'background_color_output', type: 'color' },
        { name: 'text_color_input', type: 'color' },
        { name: 'text_color_output', type: 'color' },
        { name: 'accent_color', type: 'color' },
        { name: 'select_color', type: 'color' },
        { name: 'border_radius', type: 'size' },
        // { name: 'background_blur_input', type: 'size' },
        // { name: 'background_blur_output', type: 'size' },
    ], type: 'page' },
    { name: 'modules', pages: [
        { name: 'linux_system', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
        ], type: 'page', description: 'linux_system_description' },
        { name: 'folders', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'directories', type: 'array', base: { name: 'path', type: 'path' }, default: '/' },
            { name: 'file_preview', type: 'boolean' },
        ], type: 'page', description: 'folders_description' },
        { name: 'html', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'entries', type: 'array', base: [
                { name: 'name', type: 'text' },
                { name: 'html', type: 'code' },
                { name: 'default_quality', type: 'quality' },
            ], default: { name: '', html: '', default_quality: 0.0 } },
        ], type: 'page', description: 'html_description' },
        { name: 'calculator', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'quality', type: 'quality' },
        ], type: 'page', description: 'calculator_description' },
        { name: 'linux_applications', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'directories', type: 'array', base: { name: 'path', type: 'path' }, default: '/' },
            { name: 'refresh_interval_min', type: 'size' },
        ], type: 'page', description: 'linux_applications_description' },
        { name: 'url', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'quality', type: 'quality' },
            { name: 'url_preview', type: 'boolean' },
        ], type: 'page', description: 'url_description' },
        { name: 'locate', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'search_limit', type: 'size' },
            { name: 'file_preview', type: 'boolean' },
        ], type: 'page', description: 'locate_description' },
        { name: 'shortcuts', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'shortcuts', type: 'array', base: [
                { name: 'shortcut', type: 'shortcut' },
                { name: 'script', type: 'code' },
            ], default: { shortcut: '', script: '' } },
        ], type: 'page', description: 'shortcuts_description' },
        { name: 'command', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
        ], type: 'page', description: 'command_description' },
        { name: 'scripts', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'entries', type: 'array', base: [
                { name: 'name', type: 'text' },
                { name: 'script', type: 'code' },
                { name: 'default_quality', type: 'quality' },
            ], default: { name: '', script: '', default_quality: 0.0 } },
        ], type: 'page', description: 'scripts_description' },
        { name: 'clipboard', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'refresh_time', type: 'size' },
            { name: 'maximum_history', type: 'size' },
        ], type: 'page', description: 'clipboard_description' },
        { name: 'deepl', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
        ], type: 'page', description: 'deepl_description' },
        { name: 'linux_windows', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
        ], type: 'page', description: 'linux_windows_description' },
        { name: 'google_translate', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
        ], type: 'page', description: 'google_translate_description' },
        { name: 'duckduckgo', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'debounce_time', type: 'size' },
            { name: 'quality', type: 'quality' },
            { name: 'url_preview', type: 'boolean' },
        ], type: 'page', description: 'duckduckgo_description' },
        { name: 'history', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'searchable', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'quality', type: 'quality' },
            { name: 'maximum_history', type: 'size' },
        ], type: 'page', description: 'history_description' },
        { name: 'color', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'prefix', type: 'text' },
            { name: 'quality', type: 'quality' },
            { name: 'color_preview', type: 'boolean' },
        ], type: 'page', description: 'color_description' },
    ], type: 'subheader' }
];

export default config_definition;
