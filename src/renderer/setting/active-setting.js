
import React from 'react';
import { Switch } from '@material-ui/core';

const styles = {
    input: {
        float: 'right',
        height: '3.5rem',
        padding: '0.5rem',
    },
}

function ActiveSetting(props) {
    return (
        <div style={styles.input}>
            <Switch checked={props.option} onChange={(e) => props.onUpdate(e.target.checked)}></Switch>
        </div>
    );
}

export default ActiveSetting;
