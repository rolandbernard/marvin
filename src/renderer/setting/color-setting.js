
import React from 'react';
import { ColorPicker } from 'material-ui-color';

const palette = {
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

function ColorSetting(props) {
    return (
        <div>
            <ColorPicker
                deferred
                value={props.option}
                palette={palette}
                onChange={(e) => props.onUpdate('#' + e.hex)}
            ></ColorPicker>
        </div>
    );
}

export default ColorSetting;
