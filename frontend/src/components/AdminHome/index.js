import React from 'react';
import { useHistory } from 'react-router-dom';
import AdminHeader from '../AdminHeader';
import './index.css';
import logo from './logo.png';

function AdminHome() {
  let history = useHistory();

  return (
    <>
      <AdminHeader />
      <div className='adminhome module-home'>
          
      <div className='home-container'>
        <img src={logo} alt='logo' className='logo1'/>
        <h1 style={{color:'white'}}>Welcome to AU Dashboard</h1>
        <h3 style={{color:'white'}}>Unlock Insights, Elevate Education: Your All-in-One University Data Companion</h3>
        <button className='button' onClick={() => history.push('/viewuser')}>View User</button>
        <button onClick={() => history.push('/adduser')}>Add User</button>
        <button onClick={() => history.push('/upload')}>Add Files</button>
      </div>
      </div>
    </>
  );
}

export default AdminHome;
