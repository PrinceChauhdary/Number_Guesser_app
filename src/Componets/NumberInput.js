import React from 'react';

function NumberInput({ value, onChange }) {
    return (
        <div>
            <input
                id="number-input"
                type="number"
                value={value}
                onChange={onChange}
                placeholder="Enter your Guess Number"
            />
        </div>
    );
}

export default NumberInput;

//import NumberInput from './Componets/NumberInput';
