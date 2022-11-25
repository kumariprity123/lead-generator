import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuItem } from '@mui/material';
import validator from 'validator'
import './form.css'
import { format } from '../../utils/commonLogic';
import Toast from '../../components/Toast';
import { LoginContext } from '../../Contexts/LoginContext';



export default function LeadForm(props) {
    const { refreshGrid } = props;
    const { userLoginDetails, status, setStatus, accHolder, setAccHolder, leadOwner, setLeadOwner, leadSource, setLeadSource, region, setRegion } = useContext(LoginContext);
    
    const [dateInput, setDateInput] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [mobileMsg, setMobileMsg] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isMobileValid, setIsMobileValid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastAction, setToastAction] = useState('');
    useEffect(() => {
        axios.get('http://mindfulautomations.com:8083/status').then((response) => {
            console.log('status: ', response.data);
            setStatus(response.data);
        })
        axios.get('http://mindfulautomations.com:8083/account_holder').then((response) => {
            console.log('accHolder: ', response.data);
            setAccHolder(response.data);
        })
        axios.get('http://mindfulautomations.com:8083/lead_source').then((response) => {
            console.log('leadSource: ', response.data);
            setLeadSource(response.data);
        })
        axios.post('http://mindfulautomations.com:8083/lead_owner', userLoginDetails ).then((response) => {
            console.log('leadOwner: ', response.data);
            setLeadOwner(response.data);
        })
        axios.get('http://mindfulautomations.com:8083/region').then((response) => {
            console.log('region: ', response.data);
            setRegion(response.data);
        })
    }, []);
    function getMobileNos(mobileNos) {
        if (mobileNos.includes(",")) {
            const mobiles = mobileNos.split(",");
            if (mobiles.length === 2) {
                return {
                    mobile: mobiles[0],
                    second_mobile_no: mobiles[1],
                    third_mobile_no: ""
                }
            } else {
                return {
                    mobile: mobiles[0],
                    second_mobile_no: mobiles[1],
                    third_mobile_no: mobiles[2]
                }
            }
        } else {
            return {
                mobile: mobileNos,
                second_mobile_no: "",
                third_mobile_no: ""
            }
        }
    }
    function getEmails(email) {
        if (email.includes(",")) {
            const emails = email.split(",");
            if (emails.length === 2) {
                return {
                    email: emails[0],
                    second_email_id: emails[1],
                    third_email_id: "",
                }
            } else {
                return {
                    email: emails[0],
                    second_email_id: emails[1],
                    third_email_id: emails[2],

                }
            }
        } else {
            return {
                email: email,
                second_email_id: "",
                third_email_id: "",

            }
        }
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const { mobile, second_mobile_no, third_mobile_no } = getMobileNos(data.get('mobile'));
        const { email, second_email_id, third_email_id } = getEmails(data.get('email'));
        const payload = {
            email: data.get('email'),
            next_date: dateInput,
            company_name: data.get('cName'),
            customer_name: data.get('cuName'),
            mobile,
            second_mobile_no,
            third_mobile_no,
            email,
            second_email_id,
            third_email_id,
            status: data.get('status'),
            acc_holder: data.get('accHolder'),
            lead_source: data.get('leadSource'),
            lead_owner: data.get('leadOwner'),
            region: data.get('region'),
            remarks: data.get('remarks'),
        }
        console.log("new Form Data", payload);
        axios.post('http://mindfulautomations.com:8083/insert_lead', payload).then((response) => {
            console.log(response);
            refreshGrid(payload);
            sendEmail(payload);
            showToastComponent('success');
        }, (error) => {
            showToastComponent('error');
        });

    };
    function sendEmail(payload) {
        emailjs.send('service_k8b50ib', 'template_xel9w0m', payload, 'HHTwdRgtAKauKxQCR')
            .then((result) => {
                console.log("email result", result.text);
            }, (error) => {
                console.log("email error result", error.text);
            });
    };
    const onDateSelect = (newValue) => {
        const dateObj = newValue.toDate();
        const dateValue = format(dateObj);
        setDateInput(dateValue);
    };
    const validateEmail = (e) => {
        var email = e.target.value;
        if (email.includes(",")) {
            const emails = email.split(",");
            emails.forEach((email) => {
                if (validator.isEmail(email)) {
                    setEmailMsg('Valid Email :)');
                    setIsEmailValid(true);
                } else {
                    setEmailMsg('Enter valid Email!');
                    setIsEmailValid(false);
                }
            })
        } else {
            if (validator.isEmail(email)) {
                setEmailMsg('Valid Email :)');
                setIsEmailValid(true);
            } else {
                setEmailMsg('Enter valid Email!');
                setIsEmailValid(false);
            }
        }
        setIsFormValid(isEmailValid && isMobileValid);


    }
    const validateMobile = (e) => {
        var mobileNo = e.target.value;
        if (mobileNo.includes(",")) {
            const mobiles = mobileNo.split(",");
            mobiles.forEach((mobile) => {
                if (validator.isMobilePhone(mobile)) {
                    setMobileMsg('valid number');
                    setIsMobileValid(true);
                } else {
                    setMobileMsg('Invalid Mob. Number');
                    setIsMobileValid(false);
                }
            })
        } else {
            if (validator.isMobilePhone(mobileNo)) {
                setMobileMsg('valid number');
                setIsMobileValid(true);
            } else {
                setMobileMsg('Invalid Mob. Number');
                setIsMobileValid(false);
            }
        }
        setIsFormValid(isEmailValid && isMobileValid);
    }

    function showToastComponent(actionValue) {
        setShowToast(true);
        setToastAction(actionValue);
        setTimeout(() => {
            setToastAction('');
            setShowToast(false);
        }, 3000)
    }

    return (
        <div className='container'>
            <Box component="form" className="form-container" onSubmit={handleSubmit} noValidate >
                <div className='form-left' style={{ display: "flex", flexWrap: "wrap" }}>
                    <div style={{ margin: "15px 5px 0 0" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} margin="normal">
                            <DesktopDatePicker
                                sx={{ marginTop: "10px" }}
                                margin="normal"
                                label="Next Flw Date"
                                inputFormat="MM/DD/YYYY"
                                name="nextFlwDate"
                                value={dateInput}
                                maxRows={2}
                                onChange={onDateSelect}
                                id="nxtDate"
                                renderInput={(params) => <TextField {...params} />}
                                required
                            />
                        </LocalizationProvider>
                    </div>
                    <TextField
                        sx={{ marginRight: "5px" }}
                        className='inputField'
                        margin="normal"
                        id="cName"
                        name='cName'
                        label="Company Name"
                        // maxRows={1}
                        required
                    />
                    <TextField
                        sx={{ marginRight: "5px" }}
                        className='inputField'
                        margin="normal"
                        id="cuName"
                        name="cuName"
                        label="Cust.Name"
                        maxRows={1}
                        required
                    />
                    <TextField
                        sx={{ marginRight: "5px" }}
                        className='inputField'
                        margin="normal"
                        id="mobile"
                        name="mobile"
                        label="Mobile"
                        maxRows={1}
                        onChange={(e) => validateMobile(e)}
                        inputProps={{ maxLength: 32 }}
                        helperText={`${mobileMsg} (max three Mobile with comma)`}
                        required
                    />
                    <TextField
                        sx={{ marginRight: "5px" }}
                        className='inputField'
                        margin="normal"
                        id="email"
                        name="email"
                        label="Email"
                        maxRows={1}
                        onChange={(e) => validateEmail(e)}
                        helperText={`${emailMsg} (max three email with comma)`}
                        required
                        inputProps={{
                            autoComplete: 'off'
                        }}
                    />
                    <TextField
                        sx={{ marginRight: "5px" }}
                        margin="normal"
                        className='inputField'
                        id="status"
                        name="status"
                        label="Status"
                        select
                        required
                        helperText="Please select Status"
                    >
                        {status?.result?.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ marginRight: "5px" }}
                        margin="normal"
                        id="accHolder"
                        name="accHolder"
                        select="select"
                        label="Acc. Holder"
                        required
                        helperText="Please select Acc. Holder"
                    >
                        {accHolder?.result?.map((option) => (
                            <MenuItem key={option.key} value={option['holder name']}>
                                {option['holder name']}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ marginRight: "5px" }}
                        margin="normal"
                        id="leadSource"
                        name="leadSource"
                        select
                        required
                        label="Lead Source"
                        helperText="Please select Lead Source"
                    >
                        {leadSource?.result?.map((option) => (
                            <MenuItem key={option.value} value={option['source name']}>
                                {option['source name']}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ marginRight: "5px" }}
                        margin="normal"
                        id="leadOwner"
                        name="leadOwner"
                        select
                        label="Lead Owner"
                        required
                        helperText="Please select your Lead owner"                    >
                        {leadOwner?.result?.map((option) => (
                            <MenuItem key={option.value} value={option['owner name']}>
                                {option['owner name']}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ marginRight: "5px" }}
                        margin="normal"
                        id="region"
                        name="region"
                        select
                        label="Region"
                        required
                        helperText="Please select Region"                    >
                        {region?.result?.map((option) => (
                            <MenuItem key={option.value} value={option['name']}>
                                {option['name']}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={{ marginRight: "5px" }}
                        margin="normal"
                        id="remarks"
                        name="remarks"
                        label="Remarks"
                        multiline
                        maxRows={1}
                        required
                    />

                </div>
                <div className='form-right'>
                    <Button variant="contained" margin="normal" color="success" type="submit" disabled={!isFormValid}>
                        Submit
                    </Button>
                </div>
            </Box>
            {showToast ? <Toast action={toastAction} /> : <></>}
        </div>

    );
}