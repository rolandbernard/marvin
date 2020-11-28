
import React, { createRef } from 'react';
import IFrameItem from './preview/iframe';

const preview_types = {
    iframe: IFrameItem,
};

const styles = {
    preview: {
        flex: '0 0 auto',
    },
}

function PreviewField(props) {
    const ref = createRef();
    const onLoad = () => {
        ref.current.style.width = '50%';
        ref.current.style.height = '100%';
    };
    const result = props.result;
    const preview = result && result.preview;
    return preview ? (
        <div style={styles.preview} ref={ref}>
            { React.createElement(preview_types[preview.type], { onLoad: onLoad, preview: preview, config: props.config }) }
        </div>
    ) : (
        <div></div>
    );
}

export default PreviewField;
