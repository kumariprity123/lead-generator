import React, {} from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "../pages/Main";
import Login from "../pages/Login";
import PieChart from "../pages/PieChart";

const Router = () => {


  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/main" element={<Main />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/chart" element={<PieChart />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    </BrowserRouter>
  );
};

export default Router;
