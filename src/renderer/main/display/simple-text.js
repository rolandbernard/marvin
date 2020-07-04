
import React from 'react';

const styles = {
    text: {
        fontSize: '1rem',
        fontWeight: 300,
        whiteSpace: 'pre-wrap',
        margin: '0 1rem',
        padding: '0.5rem',
    },
}

function SimpleText(props) {
    return (
        <div style={styles.text}>{props.option.text}</div>
    );
}

export default SimpleText;
