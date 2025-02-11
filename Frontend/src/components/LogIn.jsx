import React from "react";
import { useState } from 'react';
import './LogIn.css';

const LogIn = () => {
    return(
        <div className = 'wrapper'>
            <p>Sign In</p>
            <form>
                <label>Username</label>
                <input type ="text" placholder = "Username"></input>
            </form>
            <form>
                <label>Password</label>
                <input type ="text" placeholder = "Password"></input>
            </form>
        
        
        
        
        </div>

    );
    

};

export default LogIn;
