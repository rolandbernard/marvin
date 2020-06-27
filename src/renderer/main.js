
import 'typeface-roboto';
import 'material-icons';

import React from 'react';
import ReactDOM from 'react-dom';
import InputField from './input-field';
import OutputList from './output-list';

function App() {
    return (
        <div>
            <InputField></InputField>
            <OutputList></OutputList>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

