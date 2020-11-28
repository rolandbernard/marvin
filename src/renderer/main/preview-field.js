
import React, { createRef } from 'react';
import AudioPreview from './preview/audio';
import ColorPreview from './preview/color';
import EmbedPreview from './preview/embed';
import IFramePreview from './preview/iframe';
import ImagePreview from './preview/image';
import VideoPreview from './preview/video';

const preview_types = {
    iframe: IFramePreview,
    color: ColorPreview,
    image: ImagePreview,
    embed: EmbedPreview,
    video: VideoPreview,
    audio: AudioPreview,
};

const styles = {
    preview: {
        flex: '0 0 auto',
    },
    preview_none: {
        display: 'none',
        flex: '0 0 0',
        width: 0,
    },
}

function PreviewField(props) {
    const ref = createRef();
    const onLoad = (width) => {
        ref.current.style.width = width;
    };
    const result = props.result;
    const preview = result && result.preview;
    return preview ? (
        <div style={styles.preview} ref={ref}>
            { React.createElement(preview_types[preview.type], { onLoad: onLoad, preview: preview, config: props.config }) }
        </div>
    ) : (
        <div style={styles.preview_none}></div>
    );
}

export default PreviewField;
