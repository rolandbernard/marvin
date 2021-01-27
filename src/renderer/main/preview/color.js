
import React, { useEffect } from 'react';

const styles = {
    color_preview: {
        width: '100%',
        height: '100%',
    },
}

function ColorPreview(props) {
    useEffect(() => {
        if (props.onLoad) {
            props.onLoad('10%');
        }
    }, []);
    return (
        <div style={{ ...styles.color_preview, background: props.preview.color }}></div>
    );
}

export default ColorPreview;
