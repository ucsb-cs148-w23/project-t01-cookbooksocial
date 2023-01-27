import React, {useState} from 'react';
import HomePage from './pages/HomePage.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return(
    <Router>
      <Routes>

        <Route exact path="/home" element={<HomePage />} />

      </Routes>
    </Router>
  )
}

export default App;
