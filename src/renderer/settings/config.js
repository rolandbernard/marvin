
const config_definition = [
    { name: 'general', icon: 'settings', options: [
        { name: 'global_shortcut', type: 'shortcut' },
        { name: 'language', type: 'language' },
        { name: 'debounce_time', type: 'size' },
        { name: 'width', type: 'size' },
        { name: 'max_height', type: 'size' },
        { name: 'max_results', type: 'size' },
    ], type: 'page' },
    { name: 'theme', icon: 'palette', options: [
        { name: 'background_color', type: 'color' },
        { name: 'text_color', type: 'color' },
        { name: 'accent_color', type: 'color' },
        { name: 'select_color', type: 'color' },
    ], type: 'page' },
    { name: 'modules', pages: [
        { name: 'marvin_quote', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'quality', type: 'quality' },
        ], type: 'page', description: 'marvin_quote_description' },
        { name: 'linux_system', active: 'active', options: [
            { name: 'active', type: 'boolean' },
        ], type: 'page', description: 'linux_system_description' },
        { name: 'folders', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'directories', type: 'array', base: { name: 'path', type: 'path' }, default: '' },
        ], type: 'page', description: 'folders_description' },
        { name: 'html', active: 'active', options: [
            { name: 'active', type: 'boolean' },
            { name: 'entries', type: 'array', base: [
                { name: 'name', type: 'text' },
                { name: 'html', type: 'code' },
                { name: 'default_quality', type: 'quality' },
            ], default: { name: '', html: '', default_quality: 0.0 } },
        ], type: 'page', description: 'html_description' },
    ], type: 'subheader' }
];

export default config_definition;
