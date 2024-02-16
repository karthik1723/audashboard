import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';
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
const auth = getAuth();
const database = getDatabase();

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user data to the Realtime Database
      const userRef = ref(database, 'users/' + user.uid);
      set(userRef, {
        email: email,
        // Add any other user details here
      });

      // Set a success message
      setMessage('User added to the database successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error adding user:', error.message);
      setMessage('Error adding user: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <>
    <AdminHeader />
    <div className='adminuser'>
      
    <div className="app-container">
      <form onSubmit={handleAddUser} className="user-form">
        <h2>Add User</h2>
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="submit-btn">Add User</button>
        {loading && <div className="loading-bar"></div>} {/* Loading animation */}
        {message && <p className="message">{message}</p>}
      </form>
    </div>
    </div>
    </>
  );
}

export default App;
