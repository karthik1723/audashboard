import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

const Logout = () => {
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        history.push('/'); // Redirect to home page after logout
      } catch (error) {
        console.error('Logout failed:', error);
        // Optionally handle error state
      }
    };

    performLogout();
  }, [history, auth]);

  // Optionally render a loading state or nothing at all
  return <div>Logging out...</div>;
};

export default Logout;
