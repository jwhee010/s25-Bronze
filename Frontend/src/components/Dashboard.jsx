import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Navbar from './Navbar';
import './Dashboard.css';
import { useState } from 'react';
import axios from "axios";
import LogIn from './LogIn';



function Dashboard(props) {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <>
       
        <div className={`relative min-h-screen flex`}>
            <h1 className="mainheader" >
                Main Page<br/>
                {/* fetch the firstname and lastname of the user who logged in */}
               <h2 className='greeting'>Welcome, Placeholder Placeholder</h2>
            </h1>
            <div className="container max-w-screen-xl mx-auto flex flex-col justify-center items-center dashwrapper">
                <p className = "navigation">Navigation</p>
                 <Navbar />
            </div>
                <button onClick={handleLogout} className=" bg-blue-500 text-white mt-12 py-2 px-12 rounded-md hover:bg-blue-600 logout">
                   Logout
                </button>

        </div>
        </>
        // <div className={`relative min-h-screen flex`}>
        //     <div className="container max-w-screen-xl mx-auto flex flex-col justify-center items-center">
        //         <p className='text-4xl '>Main Page</p>
        //         <button onClick={handleLogout} className=" bg-blue-500 text-white mt-12 py-2 px-12 rounded-md hover:bg-blue-600">
        //             Logout
        //         </button>
        //     </div>
        // </div>
    );
}

export default Dashboard;