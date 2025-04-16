import React from "react";
import { useState } from 'react';
import axios from "axios";
import './LogIn.css';
import { useNavigate } from 'react-router-dom';
import LogInHeader from "./LogInHeader";
import Footer from "./Footer";



function LogIn(props) {
    // State variables for username, password, and error message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // variables for the first and last name.
    // In theory, a similar method should work for 
    // other objects, such as invetories or food items.
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Initialize useNavigate hook for navigation
    const navigate = useNavigate();

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Clear previous error messages
            setErrorMessage('');

            // Send login request to server
            const response = await axios.post('http://localhost:80/login', { username, password });

            // If login successful, redirect to MainPage
            if (response.status === 200) {

                // retrieve the user token
                localStorage.setItem('authToken', response.data.token);

                // navigation to the dashboard
                navigate('/main');
            }
        } catch (error) {
            console.error('Error:', error);

            // If login failed, display error message
            setErrorMessage('Your Username and\nPassword are incorrect.');
        }
    };

    const signUpHandle = () =>{
        navigate('/signup');
    };

    // JSX structure for login form
    return (
        <div>
            <LogInHeader></LogInHeader>
        <div className="flex items-center justify-center min-h-screen, wrapper">
            <div className="mx-auto p-6 bg-white rounded-md shadow-md">
                <h2 className="text-2xl font-semibold mb-6 text-center hStyling">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Login</button>
                    {errorMessage && <p className="text-red-500 text-sm whitespace-pre-line text-center mt-4 ">{errorMessage}</p>} {/* Display error message if exists */}
                </form>
                <p className="regMessage">Need an Account? Click below</p>
                <button className="registerNow"onClick={signUpHandle}>Register Now</button>
            </div>
        </div>
        <Footer></Footer>
        </div>
    );
}

export default LogIn;