
import React from 'react';
import { TextField } from '@material-ui/core';

const styles = {
    text: {
        width: '20rem',
        textAlign: 'left',
    },
};

function SizeSetting(props) {
    const onUpdate = (e) => {
        if (e.target.value.length > 0 && parseInt(e.target.value) >= 0) {
            props.onUpdate(parseInt(e.target.value));
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                value={props.option}
                variant="outlined"
                type="number"
                onChange={onUpdate}
            ></TextField>
        </div>
    );
}

export default SizeSetting;
