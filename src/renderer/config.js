
const config_definition = [
    { name: 'general', options: [
        { name: 'global_shortcut', type: 'shortcut' },
        { name: 'language', type: 'language' },
        { name: 'debounce_time', type: 'time' },
        { name: 'width', type: 'size' },
        { name: 'max_height', type: 'size' },
        { name: 'max_results', type: 'size' },
    ], type: 'page' },
    { name: 'theme', options: [
        { name: 'background_color', type: 'color' },
        { name: 'text_color', type: 'color' },
        { name: 'accent_color', type: 'color' },
        { name: 'select_color', type: 'color' },
    ], type: 'page' },
    { name: 'modules', options: [
        { name: 'marvin_quotes', options: [
            { name: 'active', type: 'active' },
        ], type: 'page' }
    ], type: 'subheader' }
];

export default config_definition;
