
import React, { createRef } from 'react';
import { CircularProgress } from '@material-ui/core';

class OutputList extends React.Component {
    constructor(props) {
        super(props);
        this.selected = createRef();
    }

    componentDidUpdate() {
        if(this.selected.current) {
            this.selected.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    render() {
        const styles = {
            root: {
                width: '100%',
                flex: '1 1 auto',
                overflow: 'auto',
                background: this.props.config && this.props.config.theme.background_color,
            },
            list: {
                width: '100%',
            },
            result: {
                width: '100%',
                color: this.props.config && this.props.config.theme.text_color,
                padding: '0.5rem',
                fontSize: '2rem',
                fontWeight: 300,
            },
            selected: {
                background: this.props.config && this.props.config.theme.accent_color,
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
                            >{option}</li>
                        ))
                        : <li style={styles.loading_wrap}><CircularProgress style={styles.loading}></CircularProgress></li>
                    }
                </ul>
            </div>
        )
    }
}

export default OutputList;
