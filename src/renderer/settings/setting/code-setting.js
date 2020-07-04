
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
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                rows={10}
                variant="outlined"
                onChange={onUpdate}
                multiline
                inputProps={{
                    style: styles.input,
                }}
            ></TextField>
        </div>
    );
}

export default CodeSetting;