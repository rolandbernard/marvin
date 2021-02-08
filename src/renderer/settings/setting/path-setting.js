
import React, { useState, useRef } from 'react';
import { TextField } from '@material-ui/core';
import { getTranslation } from '../../../common/local/locale';
import path from 'path';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function isValidPath(input) {
    try {
        return path.parse(input).root === '/';
    } catch (e) {
        return false;
    }
}

function PathSetting(props) {
    const [error, setError] = useState(null);
    const [value, setValue] = useState(null);
    const onUpdate = (e) => {
        setValue(e.target.value);
        if (isValidPath(e.target.value)) {
            props.onUpdate(e.target.value);
            setError(null);
        } else {
            setError(getTranslation(props.config, 'path_error'));
        }
    };
    const last_option = useRef(null);
    if (last_option.current !== props.option) {
        last_option.current = props.option;
        setValue(props.option);
        setError(null);
    }
    return (
        <div>
            <TextField
                value={value}
                style={styles.text}
                variant="outlined"
                onChange={onUpdate}
                error={error !== null}
                helperText={error}
            ></TextField>
        </div>
    );
}

export default PathSetting;
