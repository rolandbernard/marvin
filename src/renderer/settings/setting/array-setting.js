
import React from 'react';
import { getTranslation } from '../../../common/local/locale';
import SETTING_TYPES from './setting-types';
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
        width: '1px',
    },
};

function ArraySetting(props) {
    return (
        <div>
            <table style={styles.table}>
                <tbody>
                    {props.option && props.option.map((option, index) => (
                        !(props.def instanceof Array) ?
                            <tr style={styles.tr} key={index}>
                                <td style={styles.name}>{getTranslation(props.config, props.def.name)}</td>
                                <td style={styles.value}>
                                    {React.createElement(SETTING_TYPES[props.def.type], {
                                        option: option,
                                        def: props.base,
                                        onUpdate: (value) => {
                                            if (props.option) {
                                                props.option[index] = value;
                                                props.onUpdate(props.option);
                                            }
                                        },
                                        config: props.config,
                                    })}
                                </td>
                                <td style={styles.button}>
                                    <IconButton onClick={() => {
                                        if (props.option) {
                                            props.option.splice(index, 1);
                                            props.onUpdate(props.option);
                                        }
                                    }}><DeleteIcon></DeleteIcon></IconButton>
                                </td>
                            </tr> :
                            <tr key={index}><td style={styles.value} colSpan="2">
                                <table style={styles.table}>
                                    <tbody>
                                        {props.def.map((def) => (
                                            <tr style={styles.tr} key={def.name}>
                                                {def.type !== 'array' && <td style={styles.name}>{getTranslation(props.config, def.name)}</td>}
                                                <td style={styles.value} colSpan={def.type === 'array' ? 2 : 1}>
                                                    {def.type === 'array' && <div style={styles.array_name}>{getTranslation(props.config, def.name)}</div>}
                                                    {React.createElement(SETTING_TYPES[def.type], {
                                                        option: props.option && props.option[index][def.name],
                                                        def: def.base,
                                                        definition: def,
                                                        onUpdate: (value) => {
                                                            if (props.option) {
                                                                props.option[index][def.name] = value;
                                                                props.onUpdate(props.option);
                                                            }
                                                        },
                                                        config: props.config,
                                                    })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </td><td style={styles.button}>
                                    <IconButton onClick={() => {
                                        if (props.option) {
                                            props.option.splice(index, 1);
                                            props.onUpdate(props.option);
                                        }
                                    }}><DeleteIcon></DeleteIcon></IconButton>
                                </td></tr>
                    ))}
                    <tr><td></td><td></td><td style={styles.button}>
                        <IconButton onClick={() => {
                            if (props.option) {
                                props.option.push(JSON.parse(JSON.stringify(props.definition.default)));
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
