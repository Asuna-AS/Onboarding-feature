import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPrincipalTeacher,getTeacherStudents, updateUser, verifyStudent,verifyTeacher } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        navigate('/login');
      } else {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user)
        setUser(user);

        if (user.role === 'teacher') {
          const { data } = await getTeacherStudents();
          setStudents(data.students);
        }
        if (user.role === 'principal') {
          const { data } = await getPrincipalTeacher();
          setTeachers(data.teachers);
        }
      }
    };
    fetchUserData();
  }, [setIsAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleVerifyStudent = async (studentId) => {
    try {
      await verifyStudent(studentId);
      const updatedStudents = students.map(student => 
        student._id === studentId ? { ...student, verified: true } : student
      );
      setStudents(updatedStudents);
    } catch (err) {
      console.error('Failed to verify student', err);
    }
  };

  const handleVerifyTeachers = async (teacherId) => {
    try {
      await verifyTeacher(teacherId);
      const updatedTeachers = teachers.map(teacher => 
        teacher._id === teacherId ? { ...teacher, verified: true } : teacher
      );
      setStudents(updatedTeachers);
    } catch (err) {
      console.error('Failed to verify student', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSubmit.append(key, formData[key]);
    });
    try {
      const response = await updateUser(user._id, formDataToSubmit);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsEditing(false);
    } catch (error) {
      alert('Update failed');
    }
  };
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <button onClick={handleLogout} className="p-2 w-20 bg-red-500 text-white rounded hover:bg-red-700">
          Logout
        </button>
      </div>
      {user && (
        <>
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                />
              </div>
              <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Save
              </button>
            </form>
          ) : (
            <>
            <div className='flex justify-between my-auto items-center'>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">User Information</h3>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {user.image && <img src={`http://localhost:5000/${user.image}`} alt="Profile" className="w-32 h-32 rounded-full" />}
              </div>
              <div className='h-full flex'>
              <button onClick={handleEdit} className="p-2 bg-green-500 text-white rounded hover:bg-green-700 w-20">
                Edit Info
              </button>
              </div>
            </div>
              {user.role === 'teacher' && students.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Students in Your Class</h3>
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 border-b">Name</th>
                        <th className="py-2 border-b">Email</th>
                        <th className="py-2 border-b">Class</th>
                        <th className="py-2 border-b">Section</th>
                        <th className="py-2 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map(student => (
                        <tr key={student._id}>
                          <td className="py-2 border-b text-center">{student.name}</td>
                          <td className="py-2 border-b text-center">{student.email}</td>
                          <td className="py-2 border-b text-center">{student.class_}</td>
                          <td className="py-2 border-b text-center">{student.section}</td>
                          <td className="py-2 border-b text-center">{student.verified ? 'Verified' : <button
                            onClick={() => handleVerifyStudent(student._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Verify
                          </button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {user.role === 'principal' && teachers.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-2">Teachers in Your School</h3>
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2 border-b">Name</th>
                        <th className="py-2 border-b">Email</th>
                        <th className="py-2 border-b">Class</th>
                        <th className="py-2 border-b">Section</th>
                        <th className="py-2 border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map(teacher => (
                        <tr key={teacher._id}>
                          <td className="py-2 border-b text-center">{teacher.name}</td>
                          <td className="py-2 border-b text-center">{teacher.email}</td>
                          <td className="py-2 border-b text-center">{teacher.teachesClass}</td>
                          <td className="py-2 border-b text-center">{teacher.teachesSection}</td>
                          <td className="py-2 border-b text-center">{teacher.verified ? 'Verified' : <button
                            onClick={() => handleVerifyTeachers(teacher._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Verify
                          </button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
