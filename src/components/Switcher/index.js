import React, {useState} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const SwitchRadio = (props) => {
    const {defaultSelection, onSelected} = props;
    const [value, setValue] = useState(defaultSelection);
    const handleChange = (event) => {
        setValue(event.target.value);
        onSelected(event.target.value);
    };
    return (
        <div style={{"flex": "1 1 auto", "textAlign": "right"}}>
            <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
            >
                <FormControlLabel value="grid" control={<Radio />} label="Grid" />
                <FormControlLabel value="chart" control={<Radio />} label="Chart" />
            </RadioGroup>
        </FormControl>
        </div>
    )
}
export default SwitchRadio;