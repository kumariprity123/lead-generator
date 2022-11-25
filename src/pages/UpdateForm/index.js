import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MenuItem, Stack } from '@mui/material';
import validator from 'validator'
import { format } from '../../utils/commonLogic';
import Toast from '../../components/Toast';
import { LoginContext } from '../../Contexts/LoginContext';

// const rowData = {
//     "id": 43,
//     "nextFlwDate": "2022/11/24",
//     "companyName": "Hinduja Hospital",
//     "customer": "Hinduja Hospital",
//     "mobile": 9637410255,
//     "email": "hh@gmail.com",
//     "status": "New lead",
//     "accHolder": "Girish",
//     "leadSource": "Linkedin",
//     "leadOwner": "Girish",
//     "region": "India",
//     "remarks": "Call by 1 30 - 8th Nov (2022-11-24 11:41:23)"
// }

export default function LeadForm(props) {
    const { rowValues, onCancel, onRowUpdated, showToastBox } = props;
    console.log("row value", rowValues);
    const {status, accHolder, leadOwner, leadSource, region} = useContext(LoginContext);

    const [dateInput, setDateInput] = useState(rowValues.nextFlwDate);
    const [companyName, setCompanyName] = useState(rowValues.companyName);
    const [customerName, setCustomerName] = useState(rowValues.customer);
    const [mobile, setMobile] = useState(rowValues.mobile);
    const [email, setEmail] = useState(rowValues.email);
    const [statusValue, setStatusValue] = useState(rowValues.status);
    const [accHolderValue, setAccHolderValue] = useState(rowValues.accHolder);
    const [leadSourceValue, setLeadSourceValue] = useState(rowValues.leadSource);
    const [leadOwnerValue, setLeadOwnerValue] = useState(rowValues.leadOwner);
    const [regionValue, setRegionValue] = useState(rowValues.region);
    const [remark, setRemark] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [mobileMsg, setMobileMsg] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isMobileValid, setIsMobileValid] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastAction, setToastAction] = useState('');
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
        const dataToBeUpdated = {
            lead_id: rowValues.leadId,
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
        if (JSON.stringify(rowValues) !== JSON.stringify(dataToBeUpdated)) {
            axios.post('http://mindfulautomations.com:8083/update_lead', dataToBeUpdated).then((success) => {
                console.log("data has been updated", success);
                onRowUpdated(dataToBeUpdated);
                showToastBox('success');
                onCancel();
            }, (error) => {
                console.log(error);
                showToastBox('error');
            }
            )
        } else {
            showToastBox('error');
        }

    };
    const onDateSelect = (newValue) => {
        const dateObj = newValue.toDate();
        const dateValue = format(dateObj);
        setDateInput(dateValue);
    };
    const validateEmail = (e) => {
        var email = e.target.value;
        setEmail(email);
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


    }
    const validateMobile = (e) => {
        var mobileNo = e.target.value;
        setMobile(mobileNo);
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
    }
    function onCancleClicked() {
        onCancel();
    }

    return (
        <>
        <Box component="form" onSubmit={handleSubmit} noValidate >
            <div className='container'>
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
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                    <TextField
                        sx={{ marginRight: "5px" }}
                        className='inputField'
                        margin="normal"
                        id="cuName"
                        name="cuName"
                        label="Cust.Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
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
                        value={mobile}
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
                        value={email}
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
                        value={statusValue}
                        onChange={(e) => setStatusValue(e.target.value)}
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
                        value={accHolderValue}
                        onChange={(e) => setAccHolderValue(e.target.value)}
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
                        value={leadSourceValue}
                        onChange={(e) => setLeadSourceValue(e.target.value)}
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
                        value={leadOwnerValue}
                        onChange={(e) => setLeadOwnerValue(e.target.value)}
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
                        value={regionValue}
                        select
                        label="Region"
                        onChange={(e) => setRegionValue(e.target.value)}
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
                        onChange={(e) => setRemark(e.target.value)}
                        multiline
                        maxRows={1}
                        required
                    />

                </div>
                <div className='form-right'>
                    <Stack direction="row" spacing={2}>
                    <Button variant="contained" margin="normal" color="success" type="submit">
                        Update
                    </Button>
                        <Button variant="outlined" onClick={() => onCancleClicked()} color="error">
                            Cancle
                        </Button>
                    </Stack>
                </div>
            </div>
        </Box>
        {showToast ? <Toast action={toastAction} /> : <></>}
        </>

    );
}