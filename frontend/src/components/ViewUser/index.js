import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import AdminHeader from '../AdminHeader';
import './index.css'

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3mjvIXgowrzAntZfdwqgg0RNk6y4rwXk",
    authDomain: "major-745ad.firebaseapp.com",
    databaseURL: "https://major-745ad-default-rtdb.firebaseio.com",
    projectId: "major-745ad",
    storageBucket: "major-745ad.appspot.com",
    messagingSenderId: "460361188074",
    appId: "1:460361188074:web:cbe928a362bf723ad70d93",
    measurementId: "G-EZFP9MH10Q"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const database = getDatabase();

const ViewUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = ref(database, 'users/'); // Adjust path according to your database structure
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      const usersList = Object.keys(data).map((key) => {
        // Checking if the email is 'admin123@gmail.com'
        const level = data[key].email === 'admin123@gmail.com' ? 'Admin' : 'User';
        return {
          username: data[key].email, // Assuming email is used as username
          level: level
        };
      });
      setUsers(usersList);
    });
  }, []);

  return (
    <>
    <AdminHeader/>
    <div className='viewuser'>
      
    <div className="view-user-container">
      <h2 className="view-user-heading">User List</h2>
      <table className="view-user-table">
        <thead>
          <tr>
            <th style={{color:'black'}}>Email</th>
            <th style={{color:'black'}}>Level</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>{user.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </>
  );
};

export default ViewUser;
