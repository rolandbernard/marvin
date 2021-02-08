
import { createRef, useRef, useState } from 'react';
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
    const line_count = props.option ? props.option.split('\n').length : 1;
    const [value, setValue] = useState(null);
    const onUpdate = (e) => {
        setValue(e.target.value);
        props.onUpdate(e.target.value);
    };
    const onKeyDown = (e) => {
        if (e.key === "Tab") {
            let sel_start_pos = e.currentTarget.selectionStart;
            let sel_end_pos = e.currentTarget.selectionEnd;
            let new_value = e.target.value.substring(0, sel_start_pos) + "    " + e.target.value.substring(sel_end_pos);
            e.preventDefault();
            input.current.value = new_value;
            input.current.selectionStart = sel_start_pos + 4;
            input.current.selectionEnd = sel_start_pos + 4;
            onUpdate(e);
        }
    };
    const last_option = useRef(null);
    if (last_option.current !== props.option) {
        last_option.current = props.option;
        setValue(props.option);
    }
    return (
        <div>
            <TextField
                value={value}
                style={styles.text}
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
