
import React from 'react';
import { Input, InputAdornment } from '@material-ui/core';
import Search from '@material-ui/icons/Search';

const styles = {
    text_field: {
        width: '100%',
    },
};

function InputField() {
    return (
        <div>
            <Input
                style={styles.text_field}
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
            ></Input>
        </div>
    );
}

export default InputField;
