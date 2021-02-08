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
        ipcRenderer.send(props.definition.action);
    };
    return (
        <div style={styles.input}>
            <Button onClick={onClick} variant="outlined" size="large">
                {getTranslation(props.config, props.definition.name)}
            </Button>
        </div>
    );
}

export default ButtonSetting;