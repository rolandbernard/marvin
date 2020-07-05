
import React from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { ipcRenderer } from 'electron';

function refocus() {
    const text_field = document.getElementById('input-field');
    if (text_field) {
        text_field.focus();
    }
};

class InputField extends React.Component {
    constructor(props) {
        super(props);
        window.onfocus = refocus;

        ipcRenderer.on('reset', (_) => {
            const text_field = document.getElementById('input-field');
            if (text_field) {
                text_field.value = '';
            }
            ipcRenderer.send('input-change', '');
        });
    }

    handleUpdate(e) {
        ipcRenderer.send('input-change', e.target.value);
    }

    render() {
        const styles = {
            input: {
                width: '100%',
                background: this.props.config && this.props.config.theme.background_color,
                color: this.props.config && this.props.config.theme.text_color,
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
                color: this.props.config && this.props.config.theme.accent_color,
            }
        };

        return (
            <TextField
                id="input-field"
                variant="outlined"
                autoFocus
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
                inputRef={this.props.inputRef}
                style={styles.text_field}
                onBlur={refocus}
                onChange={(e) => this.handleUpdate(e)}
            />
        );
    }
}

export default InputField;
