
import 'typeface-roboto';
import 'material-icons';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

import InputField from './input-field';
import OutputList from './output-list';

const styles = {
    root: {
        width: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexFlow: 'column',
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
        } else if (e.key === 'ArrowDown' && this.state.results && this.state.results > 0) {
            this.setState({ selected: (this.state.results.length + this.state.selected + 1) % this.state.results.length });
        } else if (e.key === 'Escape') {
            window.close();
        } else if (e.key === 'Enter' && this.state.results && this.state.results.length > 0) {
            ipcRenderer.send('execute-option', this.state.results[this.state.selected]);
        }
    }

    render() {
        return (
            <div style={styles.root} onKeyDown={(e) => this.handle_key_down(e)}>
                <InputField config={this.state.config}></InputField>
                <OutputList config={this.state.config} selected={this.state.selected} results={this.state.results}></OutputList>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

