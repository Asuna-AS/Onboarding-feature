import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isAuth, setAuth] = useState(localStorage.getItem('token')?true:false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated, navigate]);
  return (
    <Routes>
      <Route path="/" element={isAuth?<Dashboard />: <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={isAuth?<Dashboard />: <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  );
};

export default App;
