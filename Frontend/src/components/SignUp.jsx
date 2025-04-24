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

         const navigate = useNavigate();

    const handleSubmit = async(e) =>{
        e.preventDefault();
         
        //Reset Error and Success Messages
        setErrorConfirmPass('');
        setSuccessreg('');
        setRegErrorMessage('');

        //Checks if newPassword and confirmPass match
        if(newPassword != confirmPass)
        {
            setErrorConfirmPass('Passwords Do not Match. Please re-enter');
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
     
    //Return to Login Page
    const returnHandle = () =>{
        navigate('/login');
    };

    return(
       <div>
        <h1 className="regHeader">Register A New Account <br/>🌱</h1>
        <div className="formWrapper">
        <form onSubmit={handleSubmit}>
            <div className="formMatting">
            <label htmlFor="newUsername">First Name:</label>
            <input type="text" id="newFirstname" value={newFirstname} onChange={(e) => setnewFirstname(e.target.value)} required></input>
            </div>


            <div className="formMatting">
            <label htmlFor="newUsername">Last Name:</label>
            <input type="text" id="newLastname" value={newLastname}  onChange={(e) => setnewLastname(e.target.value)} required></input>
            </div>

            <div className="formMatting">
            <label htmlFor="newUsername">Email:</label>
            <input type="text" id="newEmail" value={newEmail}  onChange={(e) => setnewEmail(e.target.value)} required></input>
            </div>

            <div className="formMatting3">
            <label htmlFor="newUsername">Username:</label>
            <input type="text" id="newUsername" value={newUsername}  onChange={(e) => setnewUsername(e.target.value)} required></input>
            </div>

            <div className="formMatting3">
            <label htmlFor="newUsername">Password:</label>
            <input type="password" id="newPassword" value={newPassword}  onChange={(e) => setnewPassword(e.target.value)} required></input>
            </div>

            <div className="formMatting2">
            <label htmlFor="newUsername">Confirm Password:</label>
            <input type="password" id="confirmPass" value={confirmPass} onChange={(e) => setconfirmPass(e.target.value)} required></input>
            </div>

            {errorConfirmPass && <p className="errSuccess">{errorConfirmPass}</p>}
            {errorRegMessage && <p className="errSuccess">{errorRegMessage}</p>}
            {successReg && <p className="errSuccess">{successReg}</p>}

            <button type="submit" className="regButton">Register</button>

          
        </form>
        </div>

        <button onClick={returnHandle}>Back to Login</button>

       </div>

    );

}

export default SignUp;