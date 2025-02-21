import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function MainPage(props) {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div className={`relative min-h-screen flex`}>
            <div className="container max-w-screen-xl mx-auto flex flex-col justify-center items-center">
                <p className='text-4xl '>Main Page</p>
                <button onClick={handleLogout} className=" bg-blue-500 text-white mt-12 py-2 px-12 rounded-md hover:bg-blue-600">
                    Logout
                </button>
            </div>
        </div>
    );
}

export default MainPage;