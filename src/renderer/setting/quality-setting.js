
import React from 'react';
import { TextField } from '@material-ui/core';

const styles = {
    text: {
        width: '20rem',
        textAlign: 'left',
    },
};

function QualitySetting(props) {
    const onUpdate = (e) => {
        if(e.target.value.length > 0 && parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 1) {
            props.onUpdate(parseFloat(e.target.value));
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

export default QualitySetting;