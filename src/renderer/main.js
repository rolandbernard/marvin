
import 'typeface-roboto';
import 'material-icons';
import './index.css';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';

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
        this.state = {};
        this.state.config = {
            theme: {
                background_color: 'black',
                text_color: 'white',
                accent_color: 'grey',
                select_color: 'blue',
            }
        };
        this.state.results = [
            'Test1', 'Test2', 'Test3', 'Test4', 'Test5',
            'Test6', 'Test7', 'Test8', 'Test9', 'Test10',
            'Test11', 'Test12', 'Test13', 'Test14', 'Test15',
            'Test16', 'Test17', 'Test18', 'Test19', 'Test20',
        ];
        this.state.selected = 0;
    }

    handle_key_down(e) {
        if (e.key === 'ArrowUp') {
            this.setState({ selected: (this.state.results.length + this.state.selected - 1) % this.state.results.length });
        } else if (e.key === 'ArrowDown') {
            this.setState({ selected: (this.state.results.length + this.state.selected + 1) % this.state.results.length });
        } else if (e.key === 'Escape') {
            window.close();
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

