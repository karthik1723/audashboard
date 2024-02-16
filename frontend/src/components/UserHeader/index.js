import {Component} from 'react'
import {Link} from 'react-router-dom'
import logo from './logo.jpeg';
import './index.css'


class UserHeader extends Component{
    render(){
        return(
            <nav className='nav-container'>   
                <ul className='ulist-container'>
                    <li>
                    <Link to='/students'>
                        <img src={logo} alt='logo' className='logo'/>
                        </Link>
                    
                            
                    
                    </li>
                    <li>
                        <Link to='/students'>
                            <button type='button' className='buttons'>Students</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/faculty'>
                            <button type='button' className='buttons'>Faculty</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/programs'>
                            <button type='button' className='buttons'>Programs</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/admissions'>
                            <button type='button' className='buttons'>Admissions</button>
                        </Link>
                    </li>
                    <li>
                        <Link to='/research-grants'>
                            <button type='button' className='buttons'>Research Grants</button>
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

export default UserHeader