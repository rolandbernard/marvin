
import React, { useState, useRef } from 'react';
import { TextField } from '@material-ui/core';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function TextSetting(props) {
    const [value, setValue] = useState(null);
    const onUpdate = (e) => {
        setValue(e.target.value);
        props.onUpdate(e.target.value);
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
                variant="outlined"
                onChange={onUpdate}
            ></TextField>
        </div>
    );
}

export default TextSetting;
