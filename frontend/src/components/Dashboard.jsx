import React, { useEffect, useState } from 'react';
import { getAllUsers, verifyUser } from '../services/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleVerify = async (userId) => {
    try {
      await verifyUser(userId);
      alert('User verified successfully');
      setUsers(users.map(user => user._id === userId ? { ...user, verified: true } : user));
    } catch (error) {
      alert('Error verifying user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user._id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p>{user.name} ({user.role}) - {user.verified ? 'Verified' : 'Not Verified'}</p>
              {user.role === 'student' && <p>Class: {user.class}, Section: {user.section}</p>}
              {user.role === 'teacher' && <p>Teaches Class: {user.teachesClass}, Teaches Section: {user.teachesSection}</p>}
            </div>
            {!user.verified && (
              <button
                onClick={() => handleVerify(user._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Verify
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
