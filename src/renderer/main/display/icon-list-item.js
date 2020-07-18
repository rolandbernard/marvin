
import React from 'react';
import { Avatar, Icon } from '@material-ui/core';

function IconListItem(props) {
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
        },
        primary: {
            fontSize: '1.25rem',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        secondary: {
            fontSize: '0.75rem',
            fontWeight: 300,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
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
                <div style={styles.primary}>{props.option.primary}</div>
                <div style={styles.secondary}>{props.option.secondary}</div>
            </div>
        </div>
    );
}

export default IconListItem;
