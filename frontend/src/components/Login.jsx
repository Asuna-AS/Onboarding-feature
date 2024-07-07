import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const { token, user, additionalData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, students: additionalData }));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRedirect = () => {
    navigate('/register')
  }

  return (
    <div className='flex items-center h-screen'>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4 outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4 outline-none"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Login
        </button>
        <p className='italic py-3 text-center'>Not a user?</p>
        <button className='w-full mx-2 border border-gray-200 bg-blue-200 hover:bg-cyan-500 rounded-[2rem] p-2' onClick={(e) => handleRedirect()}>Register</button>
      </form>
    </div>
  );
};

export default Login;
