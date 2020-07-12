
import React from 'react';
import { TextField } from '@material-ui/core';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
    },
    input: {
        fontFamily: '"Roboto Mono", monospace',
        whiteSpace: 'pre',
    },
};

function CodeSetting(props) {
    const onUpdate = (e) => {
        props.onUpdate(e.target.value);
    };
    const onKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                rowsMax={7}
                variant="outlined"
                onChange={onUpdate}
                onKeyDown={onKeyDown}
                multiline
                inputProps={{
                    style: styles.input,
                }}
            ></TextField>
        </div>
    );
}

export default CodeSetting;