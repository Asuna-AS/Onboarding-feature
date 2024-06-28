import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = (formData) => axios.post(`${API_URL}/users/register`, formData);

export const login = (formData) => axios.post(`${API_URL}/users/login`, formData);

export const getAllUsers = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
};
export const verifyUser = (userId) => {
  const token = localStorage.getItem('token');
  return axios.patch(`${API_URL}/users/verify/${userId}`, null, { headers: { Authorization: `Bearer ${token}` } });
};
export const verifyToken = (token) => axios.get(`${API_URL}/users/verify`, { headers: { Authorization: `Bearer ${token}` } });
