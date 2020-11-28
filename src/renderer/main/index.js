
import 'typeface-roboto';
import 'material-icons';
import './index.css';

import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

import InputField from './input-field';
import OutputList from './output-list';
import PreviewField from './preview-field';

const styles = {
    root: {
        width: '100%',
        display: 'flex',
        flexFlow: 'column',
        height: '100%',
    },
    output: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    list: {
        display: 'flex',
        flexFlow: 'row nowrap',
        width: '100%',
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: null,
            results: [],
            selected: 0,
        };
        this.input = createRef();

        ipcRenderer.on('update-options', (_, options) => {
            this.setState({ results: options, selected: 0 });
        });
        ipcRenderer.on('reset', (_, config) => {
            this.setState({ results: [], selected: 0, config: config });
        });
    } 

    handle_key_down(e) {
        if (e.key === 'ArrowUp' && this.state.results && this.state.results.length > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected - 1) % this.state.results.length });
            e.preventDefault();
        } else if (e.key === 'ArrowDown' && this.state.results && this.state.results.length > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected + 1) % this.state.results.length });
            e.preventDefault();
        } else if (e.key === 'Escape') {
            window.close();
        } else if (e.key === 'Enter' && this.state.results && this.state.results.length > 0) {
            ipcRenderer.send('execute-option', this.state.results[this.state.selected]);
        } else if (e.key === 'Tab' && this.state.results && this.state.results.length > 0
            && this.state.results[this.state.selected].complete) {
            this.input.current.value = this.state.results[this.state.selected].complete;
            ipcRenderer.send('input-change', this.input.current.value);
        }
    }

    render() {
        return (
            <div style={styles.root} onKeyDown={(e) => this.handle_key_down(e)}>
                <InputField config={this.state.config} inputRef={this.input}></InputField>
                <div style={styles.output}>
                    <div style={styles.list}>
                        <OutputList config={this.state.config} selected={this.state.selected} results={this.state.results}></OutputList>
                        <PreviewField config={this.state.config} result={this.state.results && this.state.results[this.state.selected]}></PreviewField>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

