
import { createRef } from 'react';
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
    const input = createRef();
    let value = props.option;
    const line_count = value ? value.split('\n').length : 1;
    const onUpdate = (e) => {
        props.onUpdate(e.target.value);
    };
    const onKeyDown = (e) => {
        value = e.target.value;
        if (e.key === "Tab") {
            let sel_start_pos = e.currentTarget.selectionStart;
            let sel_end_pos = e.currentTarget.selectionEnd;
            let new_value = value.substring(0, sel_start_pos) + "    " + value.substring(sel_end_pos);
            e.preventDefault();
            input.current.value = new_value;
            input.current.selectionStart = sel_start_pos + 4;
            input.current.selectionEnd = sel_start_pos + 4;
            onUpdate(e);
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                rowsMax={7}
                variant="outlined"
                multiline
                inputProps={{
                    onChange: onUpdate,
                    onKeyDown: onKeyDown,
                    ref: input,
                    style: styles.input,
                }}
            ></TextField>
        </div>
    );
}

export default CodeSetting;
