
import React, { useEffect } from 'react';

const styles = {
    color_preview: {
        maxWidth: '50%',
        maxHeight: '100%',
        position: 'absolute',
        right: 0,
        top: 0,
    },
}

function ImagePreview(props) {
    useEffect(() => {
        if (props.onLoad) {
            props.onLoad('0%');
        }
    }, []);
    return (
        <img style={{ ...styles.color_preview }} src={props.preview.url}></img>
    );
}

export default ImagePreview;
