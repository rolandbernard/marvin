
import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { getTranslation } from '../../common/local/locale';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function isValidShortcut(shortcut) {
    // TODO: Implement a check to prevent inserting an illegal shortcut
    return true;
}

function ShortcutSetting(props) {
    const [error, setError] = useState(null);
    const onUpdate = (e) => {
        if(isValidShortcut(e.target.value)) {
            props.onUpdate(e.target.value);
            setError(null);
        } else {
            setError(getTranslation(props.config, 'shortcut_error'));
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

export default ShortcutSetting;
