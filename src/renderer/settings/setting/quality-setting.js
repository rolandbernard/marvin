
import React, { useState, useRef } from 'react';
import { TextField } from '@material-ui/core';
import { getTranslation } from '../../../common/local/locale';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function QualitySetting(props) {
    const [error, setError] = useState(null);
    const [value, setValue] = useState(null);
    const onUpdate = (e) => {
        setValue(e.target.value);
        if (e.target.value.length > 0 && parseFloat(e.target.value) >= 0 && parseFloat(e.target.value) <= 1) {
            props.onUpdate(parseFloat(e.target.value));
            setError(null);
        } else {
            setError(getTranslation(props.config, 'quality_error'));
        }
    };
    const last_option = useRef(null);
    if (last_option.current !== props.option) {
        last_option.current = props.option;
        setValue(props.option);
        setError(null);
    }
    return (
        <div>
            <TextField
                value={value}
                style={styles.text}
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
