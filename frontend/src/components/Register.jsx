import React, { useState, useContext } from 'react';
import { register } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    class: '',
    section: '',
    teachesClass: '',
    teachesSection: '',
    orgId: ''
  });
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      alert('User registered successfully');
    } catch (error) {
      alert('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
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
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <select
        name="role"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      >
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
        <option value="principal">Principal</option>
      </select>
      {formData.role === 'student' && (
        <>
          <input
            type="text"
            name="class"
            placeholder="Class"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="text"
            name="section"
            placeholder="Section"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </>
      )}
      {formData.role === 'teacher' && (
        <>
          <input
            type="text"
            name="teachesClass"
            placeholder="Teaches Class"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="text"
            name="teachesSection"
            placeholder="Teaches Section"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </>
      )}
      <input
        type="text"
        name="orgId"
        placeholder="Organization ID"
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Register
      </button>
    </form>
  );
};

export default Register;
