
import React, { createRef } from 'react';

const styles = {
    iframe: {
        width: '0',
        height: '0',
        boxSizing: 'border-box',
        border: 'none',
    },
}

function IFramePreview(props) {
    const ref = createRef();
    const onLoad = () => {
        ref.current.style.width = '100%';
        ref.current.style.height = '100%';
        if(props.onLoad) {
            props.onLoad();
        }
    };
    return (
        <iframe ref={ref} style={styles.iframe} src={props.preview.url} onLoad={onLoad}></iframe>
    );
}

export default IFramePreview;
