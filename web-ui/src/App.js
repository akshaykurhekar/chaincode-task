import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/eventDetails.js"
import PaginationTable from "./pages/paginationTable";

// import './App.css';

function App() {
  return (
    <>    
      <Routes>
        <Route exact path="/" element={<Login/>} />
        <Route exact path="/register" element={<Register/>} />
        <Route exact path="/Home" element={<Home/>} />
        <Route exact path="/events" element={<EventDetails/>} />
        <Route exact path="/projects" element={<PaginationTable/>} />
      </Routes>
    
   </>
  );
}

export default App;
