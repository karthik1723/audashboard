import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { useHistory } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AdminHome from '../AdminHome'; // Import AdminHome component
import Students from '../Students'; // Adjusted to import Students component
import './index.css';

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

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');

  const history = useHistory(); // Use useHistory hook

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    await signInWithEmailAndPassword(auth, email, password);

    // Redirect based on the user's email (acting as a role indicator)
    if (email === "admin123@gmail.com") {
      history.push('/adminhome'); // Redirect to AdminHome using history.push
    } else {
      history.push('/students'); // Redirect to Students using history.push
    }
  } catch (error) {
    setMessage('Authentication failed: ' + error.message);
  }
};

  // Login form (default view when not logged in or specific role not identified)
  return (
    <div className='home-main'>
        <div className="login-container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div className="form-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
    </div>
    
  );
}

export default Login;