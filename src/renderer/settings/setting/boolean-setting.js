
import React from 'react';
import { Switch } from '@material-ui/core';

const styles = {
    input: {
        float: 'right',
        height: '3.5rem',
        padding: '0.5rem',
    },
}

function BooleanSetting(props) {
    const enabled = !props.definition.enabled
        || !props.config
        || props.definition.enabled.split('.').reduce((prop, key) => prop[key], props.config);
    return (
        <div style={styles.input}>
            <Switch
                checked={props.option}
                onChange={(e) => props.onUpdate(e.target.checked)}
                disabled={!enabled}
            ></Switch>
        </div>
    );
}

export default BooleanSetting;
