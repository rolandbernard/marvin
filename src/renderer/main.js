
import 'typeface-roboto';
import 'material-icons';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import InputField from './input-field';
import OutputList from './output-list';

function App() {
    const config = {
        theme: {
            background_color: 'black',
            text_color: 'white',
            accent_color: 'grey',
            select_color: 'blue',
        }
    };
    const styles = {
        root: {
            width: '100%',
            maxHeight: '100%',
            display: 'flex',
            flexFlow: 'column',
        }
    };

    return (
        <div style={styles.root}>
            <InputField config={config}></InputField>
            <OutputList config={config}></OutputList>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

