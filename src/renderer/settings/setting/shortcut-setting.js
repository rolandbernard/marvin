
import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { getTranslation } from '../../../common/local/locale';

const styles = {
    text: {
        width: '-webkit-fill-available',
        textAlign: 'left',
        height: '3.5rem',
    },
};

function isValidShortcut(shortcut) {
    return shortcut.match(new RegExp(
        '^((Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super)[+])*' + 
        '([A-Za-z0-9!"#$%&\'()*+,\\-./:;<=>?@\\[\\]\\\\^_`{|}~]|F[0-9]|F1[0-9]|F2[0-4]|num[0-9]|numdec|numadd|numsub|nummult|numdiv' + 
        'Plus|Space|Tab|Capslock|Numlock|Scrolllock|Backspace|Delete|Insert|Return|Enter|Up|Down|Left|Right|Home|End|PageUp' +
        'PageDown|Escape|Esc|VolumeUp|VolumeDown|VolumeMute|MediaNextTrack|MediaPreviousTrack|MediaStop|MediaPlayPause|PrintScreen)' + 
        '([+](Command|Cmd|Control|Ctrl|CommandOrControl|CmdOrCtrl|Alt|Option|AltGr|Shift|Super))*$', 'i'
    ));
}

function ShortcutSetting(props) {
    const [error, setError] = useState(null);
    const onUpdate = (e) => {
        if(isValidShortcut(e.target.value)) {
            props.onUpdate(e.target.value);
            setError(null);
        } else {
            setError(getTranslation(props.config, 'shortcut_error'));
        }
    };
    return (
        <div>
            <TextField
                style={styles.text}
                defaultValue={props.option}
                variant="outlined"
                onChange={onUpdate}
                error={error !== null}
                helperText={error}
            ></TextField>
        </div>
    );
}

export default ShortcutSetting;
