
import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { getTranslation } from '../../../common/local/locale';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function SizeSetting(props) {
    const [error, setError] = useState(null);
    const onUpdate = (e) => {
        if (e.target.value.length > 0 && parseInt(e.target.value) === parseFloat(e.target.value) && parseInt(e.target.value) >= 0) {
            props.onUpdate(parseInt(e.target.value));
            setError(null);
        } else {
            setError(getTranslation(props.config, 'size_error'));
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                variant="outlined"
                type="number"
                onChange={onUpdate}
                error={error !== null}
                min={0}
                helperText={error}
            ></TextField>
        </div>
    );
}

export default SizeSetting;
