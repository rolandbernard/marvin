
import React, { useEffect } from 'react';

const styles = {
    color_preview: {
        width: '50%',
        position: 'absolute',
        right: 0,
        top: 0,
    },
}

function VideoPreview(props) {
    useEffect(() => {
        if(props.onLoad) {
            props.onLoad('0%');
        }
    }, []);
    return (
        <video controls={true} autoPlay={true} style={{ ...styles.color_preview }} src={props.preview.url}></video>
    );
}

export default VideoPreview;