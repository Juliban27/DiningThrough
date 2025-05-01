import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Index from './Index';
import Signup from './SignUp';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Index" element={<Index/>} />
        <Route path="/SignUp" element={<Signup/>} />

      </Routes>
    </Router>
  );
}

export default App;
