import React from 'react';
import { getTranslation } from '../../../common/local/locale';
import { Button } from '@material-ui/core';
import { ipcRenderer } from 'electron';

const styles = {
    input: {
        float: 'right',
        margin: '0.5rem',
    },
}

function ButtonSetting(props) {
    const onClick = () => {
        if (!props.definition.warning || confirm(getTranslation(props.config, props.definition.name))) {
            ipcRenderer.send(props.definition.action);
        }
    };
    const enabled = !props.definition.enabled
        || !props.config
        || props.definition.enabled.split('.').reduce((prop, key) => prop[key], props.config);
    return (
        <div style={styles.input}>
            <Button
                onClick={onClick}
                variant="outlined"
                size="large"
                disabled={!enabled}
            >
                {getTranslation(props.config, props.definition.name)}
            </Button>
        </div>
    );
}

export default ButtonSetting;
