import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Index from './Index';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Index" element={<Index/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
