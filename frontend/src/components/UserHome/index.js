import UserHeader from '../UserHeader'
import { Component } from 'react'
import { useHistory } from 'react-router-dom';
import logo from './logo.png'
import './index.css'

function UserHome(){
    let history = useHistory();
    
        
        return(
            <>
                <div className='home-container'>
                    <img src={logo} alt='logo' className='logo1'/>
                    <h1>Welcome to AU Dashboard</h1>
                    <h3>Unlock Insights, Elevate Education: Your All-in-One University Data Companion</h3>
                    <button>Home</button>
                    <button onClick={() => history.push('/students')}>Students</button>
                    <button onClick={() => history.push('/faculty')}>Faculty</button>
                    <button onClick={() => history.push('/programs')}>Programs</button>
                    <button onClick={() => history.push('/admissions')}>Admissions</button>
                    <button onClick={() => history.push('/reseach-grants')}>Research Grants</button>
                </div>
            </>
        )
    
}

export default UserHome