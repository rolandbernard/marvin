
import React, { useEffect } from 'react';

const styles = {
    color_preview: {
        width: '30%',
        position: 'absolute',
        right: 0,
        top: 0,
    },
}

function AudioPreview(props) {
    useEffect(() => {
        if(props.onLoad) {
            props.onLoad('0%');
        }
    }, []);
    return (
        <audio controls={true} autoPlay={true} style={{ ...styles.color_preview }} src={props.preview.url}></audio>
    );
}

export default AudioPreview;