import React from 'react';
import { Link } from 'react-router-dom';
import { FaHouse, FaCalendar, FaListCheck, FaUserGroup, FaGear, FaLightbulb } from 'react-icons/fa6';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="sidebar">
            <h2>LivelyShelfs</h2>
            <nav>
                <ul>
                    <li className = "linkwrapper"><Link to="/main">
                        <FaHouse className="icon" />Home</Link>
                    </li>
                    <br/>
                    <li className = "linkwrapper"><Link to="/calendar">
                        <FaCalendar className="icon" />Inventory</Link>
                    </li>
                    <br/>
                    <li className = "linkwrapper"><Link to="/recommendations">
                        <FaLightbulb className="icon" />Recommendations</Link>
                    </li>
                    <br/>
                    <li className = "linkwrapper"><Link to="/shelfFriends">
                        <FaUserGroup className="icon" />ShelfFriends</Link>
                    </li>
                    <br/>
                    <li className = "linkwrapper"><Link to="/settings">
                        <FaGear className="icon" />Settings</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;