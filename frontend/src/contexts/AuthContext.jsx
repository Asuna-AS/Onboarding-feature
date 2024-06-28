import React, { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyToken } from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token).then(response => {
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          if (location.pathname !== '/login' && location.pathname !== '/register') {
            navigate('/login');
          }
        }
      });
    } else {
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
