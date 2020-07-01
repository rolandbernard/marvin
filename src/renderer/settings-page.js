
import React from 'react';
import { getTranslation } from '../common/local/locale';
import ActiveSetting from './setting/active-setting';
import ColorSetting from './setting/color-setting';
import LanguageSetting from './setting/language-setting';
import ShortcutSetting from './setting/shortcut-setting';
import SizeSetting from './setting/size-setting';
import QualitySetting from './setting/quality-setting';

const styles = {
    table: {
        padding: '1rem',
        margin: '1rem',
        border: '1px solid lightgrey',
        borderRadius: '0.5rem',
        whiteSpace: 'nowrap',
    },
    tr: {
    },
    name: {
        textAlign: 'left',
        fontSize: '1.1rem',
        padding: '1rem',
        width: '100%',
    },
    value: {
        textAlign: 'right',
        padding: '1rem',
    },
    desc: {
        margin: '2rem',
        fontSize: '1.1rem',
    }
};

const setting_types = {
    active: ActiveSetting,
    color: ColorSetting,
    language: LanguageSetting,
    shortcut: ShortcutSetting,
    size: SizeSetting,
    quality: QualitySetting,
};

function SettingsPage(props) {
    return (
        <div>
            <div style={styles.desc}>{props.page && props.page.def && props.page.def.description && getTranslation(props.config, props.page.def.description)}</div>
            <table style={styles.table}>
                <tbody>
                    {props.page && props.page.def && props.page.def.options && props.page.def.options.map((def) => (
                        <tr style={styles.tr} key={def.name}>
                            <td style={styles.name}>{getTranslation(props.config, def.name)}</td>
                            <td style={styles.value}>
                                {React.createElement(setting_types[def.type], {
                                    option: props.page && props.page.config && props.page.config[def.name],
                                    def: def.base_type,
                                    onUpdate: (value) => {
                                        if(props.page && props.page.config) {
                                            props.page.config[def.name] = value;
                                            props.onUpdate();
                                        }
                                    }
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
