import React, { useEffect, useState, useContext } from 'react';
import ButtonRight from "../../components/ButtonRight";

import PieChart, {
    Series,
    Tooltip,
    Export,
    Label,
    Font,
    Connector,
    Legend,
} from 'devextreme-react/pie-chart';
import axios from 'axios';
import TooltipTemplate from './TooltipTemplate.js';
import Login from '../Login';
import { LoginContext } from '../../Contexts/LoginContext.js';
import Switcher from '../../components/Switcher'
import { useNavigate } from "react-router-dom";
import CountBox from '../../components/CountBox'


function ChartApp() {
    const navigate = useNavigate();
    const { isUserLoggedIn, userLoginDetails } = useContext(LoginContext);


    const [leadGenereated, setLeadGenerated] = useState({});
    const [leadGenereatedStatus, setLeadGeneratedStatus] = useState({});
    const [leadClosed, setLeadClosed] = useState({});
    const [delayedLead, setDelayedLead] = useState({});
    const [leadDelayedByMonth, setLeadDelayedByMonth] = useState({});
    const [todayDashboard, setTodayDashboard] = useState({});
    const [totalLeadLost, settotalLeadLost] = useState({});
    const [totalPocApproved, settotalPocApproved] = useState({});
    const [totalPocStarted, settotalPocStarted] = useState({});
    const [leadDelayedByStatus, setleadDelayedByStatus] = useState({});
    const [leadDelayedByNextFollowup, setleadDelayedByNextFollowup] = useState({});
    // new Date().toDateString()"2022-11-11"
    useEffect(() => {
        axios.post('http://mindfulautomations.com:8083/dashboard', { ...userLoginDetails, date: new Date().toDateString() }).then((response) => {
            console.log("dashboard", response.data.result);
            setTodayDashboard(response.data.result);
        })
        axios.post('http://mindfulautomations.com:8083/total_lead_generated', userLoginDetails).then((response) => {
            console.log("userLoginDetails: ", userLoginDetails);
            console.log("total_lead_generated: ", response.data.result);
            setLeadGenerated(response.data.result.tot_lead_generated);
        })
        axios.post('http://mindfulautomations.com:8083/total_lead_generated_by_status', userLoginDetails).then((response) => {
            console.log("total_lead_generated_by_status: ", response.data.result.tot_lead_generated);
            setLeadGeneratedStatus(response.data.result.tot_lead_generated);
        })
        axios.post('http://mindfulautomations.com:8083/total_lead_closed', userLoginDetails).then((response) => {
            console.log("total_lead_closed': ", response.data.result);
            setLeadClosed(response.data.result.tot_lead_closed);
        })
        axios.post('http://mindfulautomations.com:8083/lead_delayed', userLoginDetails).then((response) => {
            console.log("lead_delayed:", response.data.result);
            setDelayedLead(response.data.result);
        })
        axios.post('http://mindfulautomations.com:8083/lead_delayed_by_month', userLoginDetails).then((response) => {
            console.log("lead_delayed_by_month: ", response.data.result);
            setLeadDelayedByMonth(response.data.result);
        })
        axios.post('http://mindfulautomations.com:8083/total_lead_lost', userLoginDetails).then((response) => {
            console.log("total_lead_lost: ", response.data.result.total_lead_lost);
            settotalLeadLost(response.data.result.total_lead_lost);
        })
        axios.post('http://mindfulautomations.com:8083/lead_delayed_by_status', userLoginDetails).then((response) => {
            console.log("lead_delayed_by_status: ", response.data.result);
            setleadDelayedByStatus(response.data.result);
        })
        axios.post('http://mindfulautomations.com:8083/total_poc_approved', userLoginDetails).then((response) => {
            console.log("total_poc_approved: ", response.data.result.total_poc_approved);
            settotalPocApproved(response.data.result.total_poc_approved);
        })
        axios.post('http://mindfulautomations.com:8083/total_poc_started', userLoginDetails).then((response) => {
            console.log("total_poc_started: ", response.data.result.total_poc_started);
            settotalPocStarted(response.data.result.total_poc_started);
        })
        axios.post('http://mindfulautomations.com:8083/lead_delayed_by_next_followup', userLoginDetails).then((response) => {
            console.log("leadDelayedByNextFollowup: ", response.data.result);
            setleadDelayedByNextFollowup(response.data.result);
        })
    }, [isUserLoggedIn])

    function formatText(arg) {
        return `${arg.argumentText} (${arg.percentText})`;
    }
    function onSwitherValueSelected(value) {
        if (value === 'grid') {
            navigate('/')
        }
    }
    if (isUserLoggedIn) {
        return (
            <>
                <div style={{ display: "flex" }}>
                    <Switcher defaultSelection={'chart'} onSelected={onSwitherValueSelected} />
                    <ButtonRight />
                </div>
                <div className='chart=container'>
                    <div className='countBox' style={{ textAlign: "center", display: "flex", flexWrap: "wrap", margin: "0 auto", width: "90%" }}>
                        <CountBox data={leadGenereated} label={"Total Leads"} />
                        <CountBox data={totalPocApproved} label={"Poc Approved"} />
                        <CountBox data={totalPocStarted} label={"Poc Started"} />
                        <CountBox data={leadClosed} label={"Deal Won"} />
                        <CountBox data={totalLeadLost} label={"Lead Lost"} />
                    </div>
                    <div style={{"backgroundColor": "#95A5A6"}}><h1>Today({new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear()})</h1></div>
                    <div className='first-chart-container'>
                        {todayDashboard.tot_lead_generated_by_acc_holder?.length ?
                            <PieChart
                                id="pie-chart"
                                dataSource={todayDashboard.tot_lead_generated_by_acc_holder}
                                title="Lead Status"
                                palette="Bright"
                            >
                                <Legend
                                    orientation="horizontal"
                                    itemTextPosition="right"
                                    horizontalAlignment="center"
                                    verticalAlignment="bottom"
                                    columnCount={3} />
                                <Series
                                    argumentField="status"
                                    valueField="count"
                                />
                                <Tooltip
                                    enabled={true}
                                    contentRender={TooltipTemplate}
                                />
                                <Export enabled={true} />
                            </PieChart> : <></>
                        }
                        {todayDashboard.tot_lead_closed_by_acc_holder?.length ?
                            <PieChart
                                id="pie-chart"
                                dataSource={todayDashboard.tot_lead_closed_by_acc_holder}
                                title="Lead Closed"
                                palette="Bright"
                            >
                                <Legend
                                    orientation="horizontal"
                                    itemTextPosition="right"
                                    horizontalAlignment="center"
                                    verticalAlignment="bottom"
                                    columnCount={3} />
                                <Series
                                    argumentField="status"
                                    valueField="count"
                                />
                                <Tooltip
                                    enabled={true}
                                    contentRender={TooltipTemplate}
                                />
                                <Export enabled={true} />
                            </PieChart> : <></>
                        }
                        {todayDashboard.acc_holder_added?.length ?
                            <PieChart
                                id="pie-chart"
                                dataSource={todayDashboard.acc_holder_added}
                                title="Acc. Holder Added"
                                palette="Bright"
                            >
                                <Legend
                                    orientation="horizontal"
                                    itemTextPosition="right"
                                    horizontalAlignment="center"
                                    verticalAlignment="bottom"
                                    columnCount={3} />
                                <Series
                                    argumentField="acc_holder"
                                    valueField="count"
                                >
                                </Series>
                                <Tooltip
                                    enabled={true}
                                    contentRender={TooltipTemplate}
                                />
                                <Export enabled={true} />
                            </PieChart> : <></>
                        }
                        {todayDashboard.lead_owner?.length ?
                            <PieChart
                                id="pie-chart"
                                dataSource={todayDashboard.lead_owner}
                                title="Lead Owner"
                                palette="Bright"
                            >
                                <Legend
                                    orientation="horizontal"
                                    itemTextPosition="right"
                                    horizontalAlignment="center"
                                    verticalAlignment="bottom"
                                    columnCount={3} />
                                <Series
                                    argumentField="lead_owner"
                                    valueField="count"
                                />
                                <Tooltip
                                    enabled={true}
                                    contentRender={TooltipTemplate}
                                />
                                <Export enabled={true} />
                            </PieChart> : <></>
                        }
                        {todayDashboard? <></> : <p>No Records</p>}
                    </div>
                    <div style={{"backgroundColor": "#95A5A6"}}><h1>Historical</h1></div>
                    <div className='second-chart-container'>
                        { leadGenereatedStatus?.length ?
                        <PieChart
                            id="pie-chart"
                            dataSource={leadGenereatedStatus}
                            title="Lead Status"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="status"
                                valueField="count"
                            >
                            </Series>
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> : <></>
                        }
                        {/* <PieChart
                            id="pie-chart"
                            dataSource={leadClosed}
                            title="Lead Closed"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="status"
                                valueField="count"
                            />
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> */}
                        {delayedLead?.length? 
                        <PieChart
                            id="pie-chart"
                            dataSource={delayedLead}
                            title="Delayed Lead"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="status"
                                valueField="count"
                            />
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> : <></>
                        }
                        {leadDelayedByMonth?.length ?
                        <PieChart
                            id="pie-chart"
                            dataSource={leadDelayedByMonth}
                            title="Delayed By Month"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="lead_owner"
                                valueField="delayed_days"
                            />
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> : <></>
                        }
                        {/* <PieChart
                            id="pie-chart"
                            dataSource={totalLeadLost}
                            title="Total Lead Lost"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="status"
                                valueField="count"
                            />
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> */}
                        { leadDelayedByStatus?.length ?
                        <PieChart
                            id="pie-chart"
                            dataSource={leadDelayedByStatus}
                            title="Lead Delayed By Status"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="status"
                                valueField="delayed_days"
                            />
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> : <></>
                        }
                        {/* <PieChart
                            id="pie-chart"
                            dataSource={totalPocApproved}
                            title="Total Poc Approved"
                            palette="Bright"
                        >
                            <Legend
                                orientation="horizontal"
                                itemTextPosition="right"
                                horizontalAlignment="center"
                                verticalAlignment="bottom"
                                columnCount={3} />
                            <Series
                                argumentField="status"
                                valueField="count"
                            />
                            <Tooltip
                                enabled={true}
                                contentRender={TooltipTemplate}
                            />
                            <Export enabled={true} />
                        </PieChart> */}
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <Login />
        )
    }
}

export default ChartApp;
