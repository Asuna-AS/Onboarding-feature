import React, { useState, useContext } from 'react';
import { login } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      alert('Login successful');
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div className='flex h-screen'>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto my-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-10"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
