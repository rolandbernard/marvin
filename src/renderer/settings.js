
import 'typeface-roboto';
import 'material-icons';
import './settings.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';

const styles = {
    root: {
        width: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexFlow: 'row',
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: null,
            page: 0,
        };
        
        ipcRenderer.on('reset', (_, config) => {
            this.setState({ config: config });
        });
    } 

    render() {
        return (
            <div style={styles.root}>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));