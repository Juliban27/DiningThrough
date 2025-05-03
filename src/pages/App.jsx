import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import RestaurantRegister from './RestaurantRegister';
import Index from './Index';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Index" element={<Index/>} />
        <Route path="/RestaurantRegister" element={<RestaurantRegister/>} />
      </Routes>
    </Router>
  );
}

export default App;
