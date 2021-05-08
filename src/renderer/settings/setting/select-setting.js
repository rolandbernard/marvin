
import React from 'react';
import { Select, MenuItem } from '@material-ui/core';

import { getTranslation } from '../../../common/local/locale';

const styles = {
    select: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function SelectSetting(props) {
    const onChange = (e) => {
        props.onUpdate(e.target.value);
    };
    const enabled = !props.definition.enabled
        || !props.config
        || props.definition.enabled.split('.').reduce((prop, key) => prop[key], props.config);
    return (
        <div>
            <Select
                style={styles.select}
                value={props.option || props.definition.options[0]}
                variant="outlined"
                onChange={onChange}
                disabled={!enabled}
            >
                {props.definition.options.map((option) => (
                    <MenuItem key={option} value={option}>{getTranslation(props.config, option)}</MenuItem>
                ))}
            </Select>
        </div>
    );
}

export default SelectSetting;
