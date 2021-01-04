
import React, { createRef } from 'react';
import { CircularProgress } from '@material-ui/core';

import SimpleText from './display/simple-text';
import IconListItem from './display/icon-list-item';
import HtmlItem from './display/html-item';
import IconText from './display/icon-text';
import './output-list.css';

const display_types = {
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
        if(this.selected.current) {
            this.selected.current.scrollIntoView({ behavior: this.props.config.general.smooth_scrolling ? 'smooth' : 'instant', block: 'center' });
        }
    }

    render() {
        const styles = {
            root: {
                width: '100%',
                flex: '1 1 auto',
                overflow: 'auto',
                background: this.props.config && this.props.config.theme.background_color_output,
            },
            list: {
                width: '100%',
            },
            result: {
                width: '100%',
                color: this.props.config && this.props.config.theme.text_color_output,
            },
            selected: {
                background: this.props.config && this.props.config.theme.select_color,
            },
            loading: {
                width: '2rem',
                height: '2rem',
                margin: '0.5rem auto',
                display: 'block',
                color: this.props.config && this.props.config.theme.accent_color,
            },
            loading_wrap: {
                height: '3rem',
                overflow: 'hidden',
            },
        };
        return (
            <div id="listbox" style={styles.root} >
                <ul style={styles.list}>
                    {
                        this.props.results
                        ? this.props.results.map((option, index) => (
                            <li
                                key={index}
                                style={
                                    index === this.props.selected
                                        ? { ...styles.result, ...styles.selected }
                                        : styles.result
                                }
                                ref={index === (this.props.selected % this.props.results.length) ? this.selected : null}
                            >{ React.createElement(display_types[option.type], { option: option, config: this.props.config }) }</li>
                        ))
                        : <li style={styles.loading_wrap}><CircularProgress style={styles.loading}></CircularProgress></li>
                    }
                </ul>
            </div>
        )
    }
}

export default OutputList;
