
import React from 'react';
import { getTranslation } from '../../common/local/locale';
import setting_types from './setting/setting-types';

const styles = {
    table: {
        margin: '1rem',
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
    },
    value: {
        textAlign: 'right',
        padding: '1rem',
        width: '100%',
    },
    desc: {
        margin: '2rem',
        fontSize: '1.1rem',
    },
    array_name: {
        textAlign: 'left',
        fontSize: '1.1rem',
        padding: '1rem 0',
    },
};

function SettingsPage(props) {
    return (
        <div>
            <div style={styles.desc}>{props.page && props.page.def && props.page.def.description && getTranslation(props.config, props.page.def.description)}</div>
            <table style={styles.table}>
                <tbody>
                    {props.page && props.page.def && props.page.def.options && props.page.def.options.map((def) => (
                        <tr style={styles.tr} key={def.name}>
                            {def.type !== 'array' && <td style={styles.name}>{getTranslation(props.config, def.name)}</td>}
                            <td style={styles.value} colSpan={def.type === 'array' ? 2 : 1}>
                                {def.type === 'array' && <div style={styles.array_name}>{getTranslation(props.config, def.name)}</div>} 
                                {React.createElement(setting_types[def.type], {
                                    option: props.page && props.page.config && props.page.config[def.name],
                                    def: def.base,
                                    definition: def,
                                    onUpdate: (value) => {
                                        if(props.page && props.page.config) {
                                            props.page.config[def.name] = value;
                                            props.onUpdate();
                                        }
                                    },
                                    config: props.config,
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SettingsPage;
