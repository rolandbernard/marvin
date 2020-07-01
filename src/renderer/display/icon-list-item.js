
import React from 'react';
import { Avatar, Icon } from '@material-ui/core';

const styles = {
    root: {
        display: 'flex',
        flexFlow: 'row nowrap',
    },
    avatar: {
        flex: '0 0 auto',
        paddingRight: '0.75rem',
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

function IconListItem(props) {
    return (
        <div style={styles.root}>
            <div style={styles.avatar}>
                {
                    props.option.material_icon
                        ? <Avatar alt={props.option.primary}><Icon>{props.option.material_icon}</Icon></Avatar>
                        : props.option.icon_uri
                            ? <Avatar alt={props.option.primary} src={props.option.icon_uri}></Avatar>
                            : <Avatar>{props.option.primary[0]}</Avatar>
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
