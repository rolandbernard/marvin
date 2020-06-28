
import React from 'react';

function OutputList(props) {
    const styles = {
        root: {
            width: '100%',
            flex: '1 1 auto',
            overflow: 'auto',
        },
        list: {
            width: '100%',
        },
        result: {
            width: '100%',
            background: props.config.theme.background_color,
            color: props.config.theme.text_color,
            padding: '0.5rem',
            fontSize: '2rem',
            fontWeight: 300,
        },
    };

    return (
        <div id="listbox" style={styles.root}>
            <ul id='output-list' style={styles.list}>
                <li style={styles.result}>Test 1</li>
                <li style={styles.result}>Test 2</li>
                <li style={styles.result}>Test 3</li>
                <li style={styles.result}>Test 4</li>
                <li style={styles.result}>Test 5</li>
                <li style={styles.result}>Test 6</li>
                <li style={styles.result}>Test 7</li>
                <li style={styles.result}>Test 8</li>
                <li style={styles.result}>Test 9</li>
            </ul>
        </div>
    )
}

export default OutputList;
