import React, { useState } from "react";
import ExamplePage from "./pages/ExamplePage.js";

import { Route, Routes } from "react-router-dom";
import Navbars from "./components/navbars/Navbars.jsx";

function App() {
  return (
    <>
      {/* We import the navbars component here because we want it to be used on the whole app */}
      <Navbars />
      <Routes>
        <Route exact path="/" element={<ExamplePage />} />
      </Routes>
    </>
  );
}

export default App;
