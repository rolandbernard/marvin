
import React, { createRef } from 'react';
import { CircularProgress } from '@material-ui/core';

class OutputList extends React.Component {
    constructor(props) {
        super(props);
        this.styles = {
            root: {
                width: '100%',
                flex: '1 1 auto',
                overflow: 'auto',
                background: this.props.config.theme.background_color,
            },
            list: {
                width: '100%',
            },
            result: {
                width: '100%',
                color: this.props.config.theme.text_color,
                padding: '0.5rem',
                fontSize: '2rem',
                fontWeight: 300,
            },
            selected: {
                background: this.props.config.theme.accent_color,
            },
            loading: {
                width: '2rem',
                height: '2rem',
                margin: '0.5rem auto',
                display: 'block',
                color: this.props.config.theme.accent_color,
            },
        };
        this.data = this.props.results;
        this.selected = createRef();
    }

    componentDidUpdate() {
        this.styles = {
            root: {
                width: '100%',
                flex: '1 1 auto',
                overflow: 'auto',
                background: this.props.config.theme.background_color,
            },
            list: {
                width: '100%',
            },
            result: {
                width: '100%',
                color: this.props.config.theme.text_color,
                padding: '0.5rem',
                fontSize: '2rem',
                fontWeight: 300,
            },
            selected: {
                background: this.props.config.theme.accent_color,
            },
            loading: {
                width: '2rem',
                height: '2rem',
                margin: '0.5rem auto',
                display: 'block',
                color: this.props.config.theme.accent_color,
            },
        };
        this.selected.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.data = this.props.results;
    }

    render() {
        return (
            <div id="listbox" style={this.styles.root} >
                <ul style={this.styles.list}>
                    {
                        this.data
                        ? this.data.map((option, index) => (
                            <li
                                key={index}
                                style={
                                    index === this.props.selected
                                        ? { ...this.styles.result, ...this.styles.selected }
                                        : this.styles.result
                                }
                                ref={index === (this.props.selected % this.data.length) ? this.selected : null}
                            >{option}</li>
                        ))
                        : <CircularProgress style={this.styles.loading}></CircularProgress>
                    }
                </ul>
            </div>
        )
    }
}

export default OutputList;
