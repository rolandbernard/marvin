
import React, { createRef, useEffect } from 'react';
import { render } from 'react-dom';

const styles = {
    wrap: {
        width: '50%',
        height: '100%',
        boxSizing: 'border-box',
        border: 'none',
        position: 'absolute',
        right: 0,
        top: 0,
    },
}

function EmbedPreview(props) {
    const ref = createRef();
    const onLoad = () => {
        if(props.onLoad) {
            props.onLoad('0%');
        }
    };
    useEffect(() => {
        ref.current.innerHTML = `<embed style="width:100%; height: 100%;" src="${props.preview.url}"></embed>`;
    }, [props.preview])
    return (
        <div ref={ref} style={styles.wrap} onLoad={onLoad}></div>
    );
}

export default EmbedPreview;