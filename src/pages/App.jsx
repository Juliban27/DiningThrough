import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';
import AdminRoute from '../context/AdminRoute';
import Login from './Login';
import RestaurantRegister from './RestaurantRegister';
import Index from './Index';
import Signup from './SignUp';
import Inventory from './Inventory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/index" element={<Index/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route
            path="/inventory"
            element={
              <AdminRoute>
                <Inventory/>
              </AdminRoute>
            }
          />
          <Route path="/RestaurantRegister" element={<RestaurantRegister/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;