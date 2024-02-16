import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // Import withRouter
import Header from '../Header';
import logo from './logo.png';
import './index.css';

class Home extends Component {

    handleLogin = () => {
        this.props.history.push('/login'); // Navigate to login page
    }

    render() {
        return (
            <>
            <div className='home-main'>
                <div className='home'>
                    {/* <img src={logo} alt='logo' className='logo1'/> */}
                    <h1>Welcome to AU Dashboard</h1>
                    <h3>Unlock Insights, Elevate Education: Your All-in-One University Data Companion</h3>
                    <button onClick={this.handleLogin} className='buttonhome'>Login</button> {/* Login Button */}
                </div>
            </div>
                
                    
            </>
        );
    }
}

export default withRouter(Home); // Wrap the component with withRouter
