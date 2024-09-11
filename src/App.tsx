import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import Layout from "./Pages/Layout";
import NoPage from "./Pages/NoPage";
import Login from "./Pages/Login";
import Users from "./Pages/Users";
import Emplyees from "./Pages/Emplyees";
import Home from "./Pages/Home";
import Report from "./Pages/Report";
import ReportAll from "./Pages/ReportAll";

function App() {
  return (
    <React.StrictMode>
      <HashRouter basename="/">
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route path="Users" element={<Users />} />
            <Route path="Emplyees" element={<Emplyees />} />
            <Route path="Emplyees/:id" element={<Report />} />
            <Route path="ReportAll" element={<ReportAll />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Routes>
      </HashRouter>
    </React.StrictMode>
  );
}

export default App;
