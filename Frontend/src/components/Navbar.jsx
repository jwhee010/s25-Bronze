import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li className = "linkwrapper"><Link to="/main">Home</Link></li>
                <br/>
                <li className = "linkwrapper"><Link to="/calendar">Calendar</Link></li>
                <br/>
                <li className = "linkwrapper"><Link to="/list">List</Link></li>
                <br/>
                <li className = "linkwrapper"><Link to="/main">ShelfFriends</Link></li>
                <br/>
                <li className = "linkwrapper"><Link to="/main">Settings</Link></li>

            </ul>
        </nav>
    );
};

export default Navbar;