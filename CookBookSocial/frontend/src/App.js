import React, {useState} from 'react';
import ExamplePage from './pages/ExamplePage.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return(
    <Router>
      <Routes>

        <Route exact path="/" element={<ExamplePage />} />

      </Routes>
    </Router>
  )
}

export default App;
