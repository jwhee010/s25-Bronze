import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import Navbar from './Navbar';
import './Dashboard.css';
import { jwtDecode } from 'jwt-decode'; // for token decoding
import InvTrendLineChart from './InvTrendLineChart';
import InvTrendPieChartWaste from './InvTrendPieChartWaste';
import NotificationPane from './NotificationPane';
import TemporaryDrawer from './NotificationPane';
import ShareAnalytics from './ShareAnalytics';

function Dashboard() {
    const navigate = useNavigate(); // Initialize useNavigate

    // Initialize firstname, lastname, email
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });

    useEffect(() => {
        // retrieve the locally stored token
        const token = localStorage.getItem('authToken');

        if (!token) {
            // If there's no token, go back to the to login page
            navigate('/login');
        } else {
            try {
                const decodedToken = jwtDecode(token);  // Decode the token to get user data

                // set the user data from the token
                setUser({
                    firstName: decodedToken.firstName,
                    lastName: decodedToken.lastName,
                    email: decodedToken.email,
                    UserID: decodedToken.UserID,

                });

                // token error stuff
            } catch (error) {
                console.error('Token decoding error:', error);
                navigate('/login');  // If token decoding fails, log out the user
            }
        }
    }, [navigate]);

    const handleLogout = () => {

        // remove the token when logging out
        localStorage.removeItem('authToken');

        // navigates back to the login
        navigate('/login');
    };

    return (
        <>

            <div className={`relative min-h-screen flex`}>
                <Navbar />
            {/*<NotificationPane/>*/}
                <h1 className="mainheader" >
                    Dashboard<br />
                    {/* fetch the firstname and lastname of the user who logged in */}
                    <div>
                        <h2 className='greeting'>Welcome, {user.firstName} {user.lastName}</h2>
                        <h2 className='email'>Email: {user.email}</h2>  {/* Display email */}
                    </div>
                </h1>
                {/* <div className="container max-w-screen-xl mx-auto flex flex-col justify-center items-center dashwrapper">
                <p className = "navigation">Navigation</p>
                <Navbar />
            </div> */}

                {/* Trends charts---------- */}
                <h3 className='trendHeader'>
                    Here&apos;s How Much You&apos;ve Wasted
                    <br />
                    During This Year

                </h3>
                <InvTrendLineChart />
                <h3 className='trendHeader'>
                    Top Five Items
                    <br />
                    You&apos;ve Wasted The Most
                    <br />
                </h3>
                <InvTrendPieChartWaste />

                <ShareAnalytics />

                <button onClick={handleLogout} className="logout">
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