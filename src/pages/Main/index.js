import { useContext, useState } from 'react';
import '../../App.css';
import Form from '../Form'
import Grid from '../Grid'
import axios from 'axios'
import { LoginContext } from '../../Contexts/LoginContext';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { useNavigate } from "react-router-dom";
import Login from '../Login';
import Switcher from '../../components/Switcher';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import ButtonRight from "../../components/ButtonRight";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
}));
const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));


function App() {
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(undefined);
    const [inputFormData, setInputFormData] = useState({});
    const { isUserLoggedIn } = useContext(LoginContext);

    function refreshPage(payload) {
        setInputFormData(payload);
    }

    // console.log('selected row data: ', selectedRow);
    function onSwitherValueSelected(value) {
        if (value === 'chart') {
            navigate('/chart')
        }
    }
    const [expanded, setExpanded] = useState(true);
    const [gridHeight, setGridHeight] = useState('3500px');
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setGridHeight(isExpanded ? `3500px` : '3780px');
    };

    if (isUserLoggedIn) {
        return (
            <div className="main">
                <div style={{ display: "flex" }}>
                    <Switcher defaultSelection={'grid'} onSelected={onSwitherValueSelected} />
                    <ButtonRight />
                </div>
                <header className="App-header">
                    <Accordion expanded={expanded} onChange={handleChange('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography>Generate Lead</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Form refreshGrid={refreshPage} />
                        </AccordionDetails>
                    </Accordion>
                </header>
                <main className='App-main'>
                    <Grid inputFormData={inputFormData} gridHeight={gridHeight} />
                </main>
            </div>
        );
    } else {
        return (
            <Login />
        )
    }

}

export default App;
