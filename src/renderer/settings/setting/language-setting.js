
import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

import { supported_languages } from '../../../common/local/locale';

const styles = {
    select: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function LanguageSetting(props) {
    return (
        <div>
            <Select style={styles.select} value={props.option} variant="outlined">
                {Object.keys(supported_languages).map((id) => (
                    <MenuItem key={id} value={id}>{supported_languages[id]}</MenuItem>
                ))}
            </Select>
        </div>
    );
}

export default LanguageSetting;
