
import React from 'react';
import { ColorPicker } from 'material-ui-color';

const PALETTE = {
    red: 'red',
    blue: 'blue',
    green: 'green',
    yellow: 'yellow',
    cyan: 'cyan',
    lime: 'lime',
    gray: 'gray',
    orange: 'orange',
    purple: 'purple',
    black: 'black',
    white: 'white',
    pink: 'pink',
    darkblue: 'darkblue',
};

const styles = {
    input: {
        float: 'right',
        height: '3.5rem',
        padding: '0.5rem',
    },
}

function ColorSetting(props) {
    return (
        <div style={styles.input}>
            <ColorPicker
                deferred
                value={props.option}
                palette={PALETTE}
                onChange={(e) => props.onUpdate('#' + e.hex)}
            ></ColorPicker>
        </div>
    );
}

export default ColorSetting;
