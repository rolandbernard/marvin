
import React, { useEffect } from 'react';

const styles = {
    color_preview: {
        width: '100%',
    },
}

function ImagePreview(props) {
    useEffect(() => {
        if(props.onLoad) {
            props.onLoad('50%');
        }
    }, []);
    return (
        <img style={{ ...styles.color_preview }} src={props.preview.url}></img>
    );
}

export default ImagePreview;
