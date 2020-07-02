
import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { getTranslation } from '../../common/local/locale';

const styles = {
    text: {
        width: '20rem',
        textAlign: 'left',
        maxHeight: '3.5rem',
    },
};

function QualitySetting(props) {
    const [error, setError] = useState(null);
    const onUpdate = (e) => {
        if(e.target.value.length > 0 && parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 1) {
            props.onUpdate(parseFloat(e.target.value));
            setError(null);
        } else {
            setError(getTranslation(props.config, 'quality_error'));
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
                max={1}
                helperText={error}
            ></TextField>
        </div>
    );
}

export default QualitySetting;