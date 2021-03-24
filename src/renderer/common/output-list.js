
import { ipcRenderer } from 'electron';
import React, { createRef } from 'react';
import { CircularProgress } from '@material-ui/core';

import SimpleText from './display/simple-text';
import IconListItem from './display/icon-list-item';
import HtmlItem from './display/html-item';
import IconText from './display/icon-text';
import './output-list.css';

const DISPLAY_TYPES = {
    simple_text: SimpleText,
    icon_list_item: IconListItem,
    html: HtmlItem,
    icon_text: IconText,
};

class OutputList extends React.Component {
    constructor(props) {
        super(props);
        this.selected = createRef();
    }

    componentDidUpdate() {
        if (this.selected.current) {
            this.selected.current.scrollIntoView({
                behavior: this.props.config.general.smooth_scrolling ? 'smooth' : 'instant',
                block: this.props.center ? 'center' : 'nearest'
            });
        }
    }

    handleDragStart(event, option) {
        event.preventDefault();
        if (option && option.file) {
            ipcRenderer.send('drag-start', option);
        }
    }

    render() {
        const styles = {
            root: {
                zIndex: 1000,
                width: '100%',
                flex: '1 1 auto',
                overflow: 'overlay',
                background: this.props.config && this.props.config.theme.background_color_output,
                '--accent': this.props.config && this.props.config.theme.accent_color_output,
            },
            list: {
                width: '100%',
            },
            result: {
                width: '100%',
                color: this.props.config && this.props.config.theme.text_color_output,
            },
            selected: {
                color: this.props.config && this.props.config.theme.select_text_color,
                background: this.props.config && this.props.config.theme.select_color,
                cursor: 'pointer',
            },
            loading: {
                width: '2rem',
                height: '2rem',
                margin: '0.5rem auto',
                display: 'block',
                color: this.props.config && this.props.config.theme.accent_color_output,
            },
            loading_wrap: {
                height: '3rem',
                overflow: 'hidden',
            },
        };
        return (
            <div class="listbox" style={styles.root} >
                <div style={styles.list}>
                    {
                        this.props.results
                            ? this.props.results.map((option, index) => (
                                <div
                                    onMouseMove={() => this.props.onHover && this.props.onHover(index)}
                                    onClick={() => this.props.onExec && this.props.onExec(index)}
                                    onDragStart={(e) => this.handleDragStart(e, option)}
                                    draggable={option.file ? true : false}
                                    key={index}
                                    style={
                                        index === this.props.selected
                                            ? { ...styles.result, ...styles.selected }
                                            : styles.result
                                    }
                                    ref={index === (this.props.selected % this.props.results.length) ? this.selected : null}
                                >{React.createElement(DISPLAY_TYPES[option.type], { option: option, config: this.props.config })}</div>
                            ))
                            : <div style={styles.loading_wrap}><CircularProgress style={styles.loading}></CircularProgress></div>
                    }
                </div>
            </div>
        )
    }
}

export default OutputList;
