
import React, { useEffect } from 'react';

const styles = {
    color_preview: {
        width: '100%',
    },
}

function AudioPreview(props) {
    useEffect(() => {
        if(props.onLoad) {
            props.onLoad('20%');
        }
    }, []);
    return (
        <audio controls={true} autoPlay={true} style={{ ...styles.color_preview }} src={props.preview.url}></audio>
    );
}

export default AudioPreview;