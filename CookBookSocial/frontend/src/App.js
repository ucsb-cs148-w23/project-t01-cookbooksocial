import React, { useState } from "react";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage.js";
import ExamplePage from "./pages/ExamplePage.js"

import { Route, Routes } from "react-router-dom";
import Navbars from "./components/navbars/Navbars.jsx";

function App() {
  return (
    <>
      {/* We import the navbars component here because we want it to be used on the whole app */}
      <Navbars />
      <Routes>
        <Route exact path="/home" element={<HomePage />} />
        <Route exact path="/login" element={<LoginPage />} />

        {/* This route is temporary so I can check if connection with backend is working */}
        <Route exact path="/secretpage" element={<ExamplePage />} />
      </Routes>
    </>
  );
}

export default App;
