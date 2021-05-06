
import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { ipcRenderer } from 'electron';

import OutputList from '../../common/output-list';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
    list_wrap: {
        position: 'relative',
    },
    list: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        maxHeight: '20rem',
        textAlign: 'left',
        display: 'flex',
    },
};

function optionToText(option) {
    if (option) {
        return option.text || option.html || (option.primary + ' - ' + option.secondary);
    } else {
        return '';
    }
}

let globalSetSelected = null;
let globalSetOptions = null;

ipcRenderer.on('update-options', (_, options) => {
    if (globalSetSelected && globalSetOptions) {
        globalSetSelected(0);
        globalSetOptions(options);
    }
});

function OptionSetting(props) {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(0);
    const [center, setCenter] = useState(true);
    const [value, setValue] = useState('');
    const onUpdate = (event) => {
        setValue(event.target.value);
        ipcRenderer.send('search-options', event.target.value);
    };
    const onKeyDown = (event) => {
        if (event.key === 'ArrowUp' && options && options.length > 0) {
            setSelected((options.length + selected - 1) % options.length);
            setCenter(true);
            event.preventDefault();
        } else if (event.key === 'ArrowDown' && options && options.length > 0) {
            setSelected((options.length + selected + 1) % options.length);
            setCenter(true);
            event.preventDefault();
        } else if (event.key === 'Escape') {
            setValue('');
            setOptions([]);
        } else if (event.key === 'Enter' && options && options.length > 0) {
            props.onUpdate(options[selected]);
            setValue('');
            setOptions([]);
        } else if (event.key === 'Tab' && options && options.length > 0 && options[selected].complete) {
            const val = options[selected].complete;
            setValue(val);
            ipcRenderer.send('search-options', val);
        }
        onFocus();
    };
    const onFocus = () => {
        globalSetOptions = setOptions;
        globalSetSelected = setSelected;
    };
    const onBlur = () => {
        globalSetOptions = null;
        globalSetSelected = null;
    };
    const onHover = (index) => {
        if (index != selected) {
            setSelected(index);
            setCenter(false);
        }
    };
    const onExec = (index) => {
        onHover(index);
        props.onUpdate(options[selected]);
        setValue('');
        setOptions([]);
    };
    const enabled = !props.definition.enabled
        || !props.config
        || props.definition.enabled.split('.').reduce((prop, key) => prop[key], props.config);
    return (
        <div>
            <TextField
                style={styles.text}
                placeholder={optionToText(props.option)}
                value={value}
                variant="outlined"
                onChange={onUpdate}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                disabled={!enabled}
            ></TextField>
            <div style={styles.list_wrap}>
                <div style={styles.list}>
                    <OutputList
                        onHover={onHover}
                        onExec={onExec}
                        config={props.config}
                        selected={selected}
                        center={center}
                        results={options}
                    ></OutputList>
                </div>
            </div>
        </div>
    );
}

export default OptionSetting;
