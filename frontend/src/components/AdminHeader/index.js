import {Component} from 'react'
import {Link} from 'react-router-dom'
import logo from './logo.jpeg'

import './index.css'


class AdminHeader extends Component{
    render(){
        return(
            <nav className='nav-container'>   
                <ul className='ulist-container'>
                    <li>
                        <Link to="/AdminHome">
                            <img src={logo} alt='logo' className='logo'/>
                        </Link>
                    </li>
                    <li>
                        <Link to='/adduser'>
                            <button type='button' className='buttons'>Add User</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/viewuser'>
                            <button type='button' className='buttons'>View User</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/upload'>
                            <button type='button' className='buttons'>Upload Files</button>
                        </Link>
                    </li>

                    <li>
                        <Link to='/deleteuser'>
                            <button type='button' className='buttons'>Delete User</button>
                        </Link>
                    </li>

                    <li>
                    <Link to='/logout'>
                        <button type='button' className='buttons'>Logout</button>
                    </Link>
                    </li>
                </ul>
                <hr className='hrule'/>
            </nav>
            
        )
    }
}

export default AdminHeader;