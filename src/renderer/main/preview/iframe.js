
import React, { createRef } from 'react';

const styles = {
    iframe: {
        width: '0',
        height: '0',
        boxSizing: 'border-box',
        border: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
    },
}

function IFramePreview(props) {
    const ref = createRef();
    const onLoad = () => {
        ref.current.style.width = '50%';
        ref.current.style.height = '100%';
        if(props.onLoad) {
            console.log(ref.current.currentDocument.body.innerHTML);
            if(ref.current.currentDocument.body.innerHTML) {
                props.onLoad('50%');
            }
        }
    };
    return (
        <iframe ref={ref} style={styles.iframe} src={props.preview.url} onLoad={onLoad}></iframe>
    );
}

export default IFramePreview;
