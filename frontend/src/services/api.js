import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

export const register = (data) => axios.post(`${API_URL}/auth/register`, data);

export const login = (formData) => axios.post(`${API_URL}/auth/login`, formData);

export const getTeacherStudents = () => axios.get(`${API_URL}/users/teacher/students`, { headers: { Authorization: `Bearer ${getToken()}` } });

export const getPrincipalTeacher = () => axios.get(`${API_URL}/users/principal/teachers`, { headers: { Authorization: `Bearer ${getToken()}` } });

export const getAllUsers = () =>
  axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${getToken()}` } });

export const updateUser = (userId, data) => axios.put(`${API_URL}/users/update/${userId}`, data, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'multipart/form-data'
  }
});

export const verifyStudent = (studentId) => axios.post(`${API_URL}/users/verify-student/${studentId}`, {}, {
  headers: { Authorization: `Bearer ${getToken()}` }
});

export const verifyTeacher = (teacherId) => axios.post(`${API_URL}/users/verify-teacher/${teacherId}`, {}, {
  headers: { Authorization: `Bearer ${getToken()}` }
});
