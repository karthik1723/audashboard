import React, { useState, useEffect } from 'react';
import { getDatabase, ref, remove, onValue } from 'firebase/database';
import AdminHeader from '../AdminHeader';
import './index.css'

function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const database = getDatabase();
    const usersRef = ref(database, 'users/');

    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      const loadedUsers = Object.keys(usersData || {}).map(key => ({
        id: key,
        email: usersData[key].email // Assuming each user object has an email
      }));
      setUsers(loadedUsers);
    });
  }, []);

  const handleDelete = async () => {
    const database = getDatabase();

    try {
      // Deleting user data from Firebase Realtime Database
      const userRef = ref(database, 'users/' + selectedUserId);
      await remove(userRef);

      setMessage('User deleted successfully.');
      setUsers(users.filter(user => user.id !== selectedUserId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user: ' + error.message);
    }
  };

  return (
    <>
      <AdminHeader />
      <div className='deleteuser'>
        
      <div className="admin-delete-user-container" >
        <select onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId}>
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
        <button onClick={handleDelete} disabled={!selectedUserId}>Delete User</button>
        {message && <p>{message}</p>}
      </div>
      </div>
    </>
  );
}

export default DeleteUser;
