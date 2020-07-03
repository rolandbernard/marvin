
import React from 'react';
import { getTranslation } from '../../common/local/locale';
import setting_types from './setting-types';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const styles = {
    table: {
        border: '1px solid lightgrey',
        borderRadius: '0.5rem',
        whiteSpace: 'nowrap',
        width: '-webkit-fill-available',
    },
    tr: {
    },
    name: {
        textAlign: 'left',
        fontSize: '1.1rem',
        padding: '1rem',
        width: 'min-content',
    },
    value: {
        textAlign: 'right',
        padding: '1rem',
        width: '100%',
    },
    button: {
        padding: '0.5rem',
    },
};

function ArraySetting(props) {
    return (
        <div>
            <table style={styles.table}>
                <tbody>
                    {props.option && props.option.map((option, index) => (
                        <tr style={styles.tr} key={index}>
                            <td style={styles.name}>{getTranslation(props.config, props.def.name)}</td>
                            <td style={styles.value}>
                                {React.createElement(setting_types[props.def.type], {
                                    option: option,
                                    def: props.base,
                                    onUpdate: (value) => {
                                        if(props.option) {
                                            props.option[index] = value;
                                            props.onUpdate(props.option);
                                        }
                                    },
                                    config: props.config,
                                })}
                            </td>
                            <td style={styles.button}>
                                <IconButton onClick={() => {
                                    if(props.option) {
                                        props.option.splice(index, 1);
                                        props.onUpdate(props.option);
                                    }
                                }}><DeleteIcon></DeleteIcon></IconButton>
                            </td>
                        </tr>
                    ))}
                    <tr><td></td><td></td><td style={styles.button}>
                        <IconButton onClick={() => {
                            if (props.option) {
                                props.option.push(null);
                                props.onUpdate(props.option);
                            }
                        }}><AddIcon></AddIcon></IconButton>
                    </td></tr>
                </tbody>
            </table>
        </div>
    );
}

export default ArraySetting;
