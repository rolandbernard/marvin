
import React from 'react';
import { TextField } from '@material-ui/core';

const styles = {
    text: {
        width: '20rem',
        textAlign: 'left',
    },
};

function isValidShortcut(shortcut) {
    // TODO: Implement a check to prevent inserting an illegal shortcut
    return true;
}

function ShortcutSetting(props) {
    const onUpdate = (e) => {
        if(isValidShortcut(e.target.value)) {
            props.onUpdate(e.target.value);
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                value={props.option}
                variant="outlined"
                onChange={onUpdate}
            ></TextField>
        </div>
    );
}

export default ShortcutSetting;
