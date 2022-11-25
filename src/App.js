import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './App.css';
import Router from './router'
import {LoginContext} from "./Contexts/LoginContext"
import { useState } from 'react';

function App() {
  const [userLoginDetails, setUserLoginDetails] = useState({});
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [status, setStatus] = useState({});
  const [accHolder, setAccHolder] = useState({});
    const [leadSource, setLeadSource] = useState({});
    const [leadOwner, setLeadOwner] = useState({});
    const [updatedRow, setUpdatedRow] = useState({});
    const [region, setRegion] = useState({});
  return (
    <div className="App">
      <LoginContext.Provider value={{region, setRegion, updatedRow, setUpdatedRow, leadOwner, setLeadOwner, leadSource, setLeadSource, accHolder, setAccHolder, userLoginDetails, setUserLoginDetails, isUserLoggedIn, setIsUserLoggedIn, status, setStatus}}>
      <Router />
      </LoginContext.Provider>
    </div>
  );
}

export default App;
