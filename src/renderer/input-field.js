
import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

function InputField(props) {
    const styles = {
        input: {
            width: '100%',
            background: props.config.theme.background_color,
            color: props.config.theme.text_color,
            fontSize: '1.5rem',
            fontWeight: 300,
            borderRadius: 0,
            padding: '0.25rem',
        },
        text_field: {
            margin: 0,
            flex: '0 0 auto',
        },
        icon: {
            width: '2rem',
            height: '2rem',
            marginRight: '0.25rem',
            marginLeft: '0.5rem',
            color: props.config.theme.accent_color,
        }
    };

    const refocus = () => {
        const text_field = document.getElementById('input-field');
        if(text_field) {
            text_field.focus();
        }
    };
    window.onfocus = refocus;

    return (
        <TextField
            id="input-field"
            variant="outlined"
            focused={false}
            InputProps={{
                type: 'text',
                margin: 'dense',
                startAdornment: (
                    <InputAdornment position="start" >
                        <Search style={styles.icon} />
                    </InputAdornment>
                ),
                style: styles.input
            }}
            style={styles.text_field}
            onBlur={refocus}
        />
    );
}

export default InputField;
