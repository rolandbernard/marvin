
import React from 'react';
import { Switch } from '@material-ui/core';

function ActiveSetting(props) {
    return (
        <div>
            <Switch checked={props.option} onChange={(e) => props.onUpdate(e.target.checked)}></Switch>
        </div>
    );
}

export default ActiveSetting;
