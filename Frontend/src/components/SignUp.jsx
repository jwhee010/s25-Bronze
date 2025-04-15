import React from "react";
import { useState } from 'react';
import axios from "axios";
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { preventDefault } from "@fullcalendar/core/internal";

function SignUp(){
        const [newFirstname, setnewFirstname] = useState('');
        const [newLastname, setnewLastname] = useState('');
        const [newUsername, setnewUsername] = useState('');
        const [newEmail, setnewEmail] = useState('');
        const [newPassword, setnewPassword] = useState('');
        const [confirmPass, setconfirmPass] = useState('');

        const [errorRegMessage, setRegErrorMessage] = useState('');
        const [errorConfirmPass, setErrorConfirmPass] = useState('');
        const [successReg, setSuccessreg] = useState('');

    const handleSubmit = async(e) =>{
        e.preventDefault();
         
        //Checks if newPassword and confirmPass match
        setErrorConfirmPass('');
        setSuccessreg('');
        setRegErrorMessage('');

        if(newPassword != confirmPass)
        {
            setErrorConfirmPass('Passwords Do not Match. Please re-enter to confirm');
            return 0;
        }
        
        //Sign Up query
        try
        {
          const response = await axios.post('http://localhost:80/signup', {newUsername, newFirstname, newLastname, newPassword, newEmail});
          setRegErrorMessage('');

          if(response.status == 200){
            console.log('Success')
          }

          setSuccessreg('Account Registered Successfully!');
        }
        catch(error)
        {
            console.error('Error:', error);
            setRegErrorMessage('Username: ' + newUsername + " is Already Taken");
        }
    };

    return(
       <div>
        <h1>Register A New Account</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="newUsername">First Name:</label>
            <input type="text" id="newFirstname" value={newFirstname} onChange={(e) => setnewFirstname(e.target.value)} required></input>
            </div>

            <div>
            <label htmlFor="newUsername">Last Name:</label>
            <input type="text" id="newLastname" value={newLastname}  onChange={(e) => setnewLastname(e.target.value)} required></input>
            </div>

            <div>
            <label htmlFor="newUsername">Email:</label>
            <input type="text" id="newEmail" value={newEmail}  onChange={(e) => setnewEmail(e.target.value)} required></input>
            </div>

            <div>
            <label htmlFor="newUsername">Username:</label>
            <input type="text" id="newUsername" value={newUsername}  onChange={(e) => setnewUsername(e.target.value)} required></input>
            </div>

            <div>
            <label htmlFor="newUsername">Password:</label>
            <input type="text" id="newPassword" value={newPassword}  onChange={(e) => setnewPassword(e.target.value)} required></input>
            </div>

            <div>
            <label htmlFor="newUsername">Confirm Password:</label>
            <input type="text" id="confirmPass" value={confirmPass} onChange={(e) => setconfirmPass(e.target.value)} required></input>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Register</button>
            {errorConfirmPass && <p className="text-red-500 text-sm whitespace-pre-line text-center mt-4 ">{errorConfirmPass}</p>}
            {errorRegMessage && <p className="text-red-500 text-sm whitespace-pre-line text-center mt-4 ">{errorRegMessage}</p>}
            {successReg && <p className="text-red-500 text-sm whitespace-pre-line text-center mt-4 ">{successReg}</p>}


        </form>
       </div>

    );

}

export default SignUp;