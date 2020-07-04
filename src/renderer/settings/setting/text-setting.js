
import React from 'react';
import { TextField } from '@material-ui/core';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function TextSetting(props) {
    const onUpdate = (e) => {
        props.onUpdate(e.target.value);
    };
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                variant="outlined"
                onChange={onUpdate}
            ></TextField>
        </div>
    );
}

export default TextSetting;