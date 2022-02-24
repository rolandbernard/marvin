
export interface InputTheme {
    background_color: string;
    text_color: string;
    accent_color: string;
    shadow_color: string;
}

export interface OutputTheme {
    background_color: string;
    text_color: string;
    accent_color: string;
    select_color: string;
    select_text_color: string;
    shadow_color: string;
}

export interface SettingsTheme {
    background_color: string;
    text_color: string;
    accent_color: string;
    select_color: string;
    select_text_color: string;
    active_color: string;
    shadow_color: string;
}

export interface Theme {
    border_radius: number;
    input: InputTheme;
    output: OutputTheme;
    settings: SettingsTheme;
}

export const THEMES = {
    default: {
        border_radius: 5,
        input: {
            background_color: "#1a1e22",
            text_color: "#ffffff",
            accent_color: "#f0f0f0",
            shadow_color: "#00000000"
        },
        output: {
            background_color: "#1f2327",
            text_color: "#f0f0f0",
            accent_color: "#f0f0f0",
            select_color: "#313943",
            select_text_color: "#f0f0f0",
            shadow_color: "#00000020"
        },
        settings: {
            background_color: '#ffffff',
            text_color: '#000000',
            accent_color: '#505050',
            select_color: '#e0e0e0',
            select_text_color: '#000000',
            active_color: '#23d160',
            shadow_color: '#00000020',
        },
    },
    all_dark: {
        border_radius: 5,
        input: {
            background_color: "#1a1e22",
            text_color: "#ffffff",
            accent_color: "#f0f0f0",
            shadow_color: "#00000000"
        },
        output: {
            background_color: "#1f2327",
            text_color: "#f0f0f0",
            accent_color: "#f0f0f0",
            select_color: "#313943",
            select_text_color: "#f0f0f0",
            shadow_color: "#00000020"
        },
        settings: {
            background_color: "#171a1e",
            text_color: "#f0f0f0",
            accent_color: "#b0b0b0",
            select_color: "#313943",
            select_text_color: "#f0f0f0",
            active_color: "#1ca54c",
            shadow_color: "#00000020"
        }
    },
    black: {
        border_radius: 0,
        input: {
            background_color: '#000000',
            text_color: '#ffffff',
            accent_color: '#f0f0f0',
            shadow_color: '#00000000',
        },
        output: {
            background_color: '#000000',
            text_color: '#f0f0f0',
            accent_color: '#f0f0f0',
            select_color: '#202020',
            select_text_color: '#f0f0f0',
            shadow_color: '#00000020',
        },
        settings: {
            background_color: '#ffffff',
            text_color: '#000000',
            accent_color: '#505050',
            select_color: '#e0e0e0',
            select_text_color: '#000000',
            active_color: '#23d160',
            shadow_color: '#00000020',
        },
    },
    all_black: {
        border_radius: 0,
        input: {
            background_color: '#000000',
            text_color: '#ffffff',
            accent_color: '#f0f0f0',
            shadow_color: '#00000000',
        },
        output: {
            background_color: '#000000',
            text_color: '#f0f0f0',
            accent_color: '#f0f0f0',
            select_color: '#202020',
            select_text_color: '#f0f0f0',
            shadow_color: '#00000020',
        },
        settings: {
            background_color: '#050505',
            text_color: '#f0f0f0',
            accent_color: '#b0b0b0',
            select_color: '#202020',
            select_text_color: '#f0f0f0',
            active_color: '#178c40',
            shadow_color: '#000000e0',
        },
    },
    semi_transparent: {
        border_radius: 5,
        input: {
            background_color: '#1f252af5',
            text_color: '#ffffff',
            accent_color: '#f0f0f0',
            shadow_color: '#00000000',
        },
        output: {
            background_color: '#262c33d0',
            text_color: '#f0f0f0',
            accent_color: '#f0f0f0',
            select_color: '#313943d0',
            select_text_color: '#f0f0f0',
            shadow_color: '#00000020',
        },
        settings: {
            background_color: '#ffffff',
            text_color: '#000000',
            accent_color: '#505050',
            select_color: '#e0e0e0',
            select_text_color: '#000000',
            active_color: '#23d160',
            shadow_color: '#00000020',
        },
    },
    atom: {
        border_radius: 5,
        input: {
            background_color: '#292d34',
            text_color: '#b5bcb5',
            accent_color: '#be8a59',
            shadow_color: '#00000000',
        },
        output: {
            background_color: '#2c3038',
            text_color: '#b5bcb5',
            accent_color: '#be8a59',
            select_color: '#30353d',
            select_text_color: '#b5bcb5',
            shadow_color: '#00000020',
        },
        settings: {
            background_color: '#292d34',
            text_color: '#b5bcb5',
            accent_color: '#be8a59',
            select_color: '#30353d',
            select_text_color: '#b5bcb5',
            active_color: '#90b061',
            shadow_color: '#00000020',
        },
    },
    solarized: {
        border_radius: 5,
        input: {
            background_color: '#002b36',
            text_color: '#fdf6e3',
            accent_color: '#eee8d5',
            shadow_color: '#00000000',
        },
        output: {
            background_color: '#073642',
            text_color: '#fdf6e3',
            accent_color: '#eee8d5',
            select_color: '#586e75',
            select_text_color: '#fdf6e3',
            shadow_color: '#00000020',
        },
        settings: {
            background_color: '#073642',
            text_color: '#fdf6e3',
            accent_color: '#eee8d5',
            select_color: '#586e75',
            select_text_color: '#fdf6e3',
            active_color: '#859900',
            shadow_color: '#00000020',
        },
    },
    blue: {
        border_radius: 5,
        input: {
            background_color: '#1f213f',
            text_color: '#e3e3e3',
            accent_color: '#fedfc2',
            shadow_color: '#00000000',
        },
        output: {
            background_color: '#191a33',
            text_color: '#e3e3e3',
            accent_color: '#fedfc2',
            select_color: '#1d1e3a',
            select_text_color: '#e3e3e3',
            shadow_color: '#00000020',
        },
        settings: {
            background_color: '#191a33',
            text_color: '#e3e3e3',
            accent_color: '#fedfc2',
            select_color: '#1d1e3a',
            select_text_color: '#e3e3e3',
            active_color: '#8bbde5',
            shadow_color: '#00000020',
        },
    },
};

