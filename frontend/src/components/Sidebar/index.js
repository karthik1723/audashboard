import { Component } from "react";
import {Link} from 'react-router-dom'
import logo from './logo.jpeg';
import './index.css';

class Sidebar extends Component{
    render() {
        return(
            <div className="sidebar-main">
                    <Link to='/students'>
                            <img src={logo} alt='logo' className='logo-sidebar'/>
                    </Link>
                    <Link to='/students'>
                        <button type='button' className='buttons'>Students</button>
                    </Link>
                    <Link to='/faculty'>
                        <button type='button' className='buttons'>Faculty</button>
                    </Link>
                    <Link to='/programs'>
                        <button type='button' className='buttons'>Programs</button>
                    </Link>
                    <Link to='/admissions'>
                        <button type='button' className='buttons'>Admissions</button>
                    </Link>
                    <Link to='/research-grants'>
                        <button type='button' className='buttons'>Research Grants</button>
                    </Link>
                    <Link to='/logout'>
                        <button type='button' className='buttons-logout'>Logout</button>
                    </Link>
            </div>
        )
    }
}

export default Sidebar