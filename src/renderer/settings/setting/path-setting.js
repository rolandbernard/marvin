
import React, { useState } from 'react';
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
    } catch(e) {
        return false;
    }
}

function PathSetting(props) {
    const [error, setError] = useState(null);
    const onUpdate = (e) => {
        if(isValidPath(e.target.value)) {
            props.onUpdate(e.target.value);
            setError(null);
        } else {
            setError(getTranslation(props.config, 'path_error'));
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                variant="outlined"
                onChange={onUpdate}
                error={error !== null}
                helperText={error}
            ></TextField>
        </div>
    );
}

export default PathSetting;
