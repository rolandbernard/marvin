
import React from 'react';
import { Avatar, Icon } from '@material-ui/core';

function IconText(props) {
    const styles = {
        root: {
            display: 'flex',
            flexFlow: 'row nowrap',
            padding: '0.5rem',
        },
        avatar_wrap: {
            flex: '0 0 auto',
            paddingRight: '0.25rem',
        },
        avatar: {
            color: props.config && props.config.theme.accent_color,
            background: 'transparent',
        },
        text: {
            flex: '1 1 auto',
            display: 'flex',
            flexFlow: 'column',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '1rem',
            fontWeight: 300,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            padding: '0.25rem 0',
            maxHeight: '15rem',
        },
    }

    return (
        <div style={styles.root}>
            <div style={styles.avatar_wrap}>
                {
                    props.option.material_icon
                        ? <Avatar variant="square" alt={props.option.icon_alt || props.option.primary} style={styles.avatar}><Icon>{props.option.material_icon}</Icon></Avatar>
                        : props.option.uri_icon
                            ? <Avatar variant="square" alt={props.option.icon_alt || props.option.primary} src={props.option.uri_icon} style={styles.avatar}></Avatar>
                            : <Avatar variant="square" style={styles.avatar}>{(props.option.icon_alt || props.option.primary)[0]}</Avatar>
                }
            </div>
            <div style={styles.text}>
                {props.option.text}
            </div>
        </div>
    );
}

export default IconText;
