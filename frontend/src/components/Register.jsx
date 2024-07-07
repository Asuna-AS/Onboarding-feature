import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    class_: '',
    section: '',
    teachesClass: '',
    teachesSection: '',
    orgId: '',
    image: null
  });
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRedirect = () => {
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      const { token, user, additionalData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, students: additionalData }));
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      alert('Error registering user');
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-8 text-center">Register</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-2 text-gray-700">Role</label>
            <select
              name="role"
              id="role"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
            </select>
          </div>
          {formData.role === 'student' && (
            <>
              <div>
                <label htmlFor="class_" className="block mb-2 text-gray-700">Class</label>
                <input
                  type="text"
                  name="class_"
                  id="class_"
                  placeholder="Class"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="section" className="block mb-2 text-gray-700">Section</label>
                <input
                  type="text"
                  name="section"
                  id="section"
                  placeholder="Section"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
          {formData.role === 'teacher' && (
            <>
              <div>
                <label htmlFor="teachesClass" className="block mb-2 text-gray-700">Teaches Class</label>
                <input
                  type="text"
                  name="teachesClass"
                  id="teachesClass"
                  placeholder="Teaches Class"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="teachesSection" className="block mb-2 text-gray-700">Teaches Section</label>
                <input
                  type="text"
                  name="teachesSection"
                  id="teachesSection"
                  placeholder="Teaches Section"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
          <div>
            <label htmlFor="orgId" className="block mb-2 text-gray-700">Organization Name</label>
            <input
              type="text"
              name="orgId"
              id="orgId"
              placeholder="Organization Name"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="image" className="block mb-2 text-gray-700">Profile Image</label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        </div>
        <button type="submit" className="w-full mt-6 p-3 bg-blue-500 text-white rounded hover:bg-blue-700">
          Register
        </button>
        <div className="w-full flex items-center justify-center my-4">
          <button className="w-full bg-gray-500 text-white text-center border p-3 rounded" onClick={handleRedirect}>
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
