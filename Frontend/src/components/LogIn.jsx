import React from "react";
import { useState } from 'react';
import Axios from "axios";
import './LogIn.css';

const LogIn = () => {

    const [userName, setUsername] = useState("");
    const [passwordHash, setPassword] = useState("");

    const login = () => {
        Axios.post("http://localhost:80/login", {
            userName: userName,
            passwordHash: passwordHash,
        }).then((response) => {
            console.log(response);
        });
    };

    return(
        <div className = 'wrapper'>
            <p>Sign In</p>
            <form>
                <label>Username</label>
                <input type ="text" placholder = "Username" onChange = {(e) => {
                    setUsername(e.target.value);
                }}></input>
            </form>
            <form>
                <label>Password</label>
                <input type ="text" placeholder = "Password" onChange = {(e) => {
                    setPassword(e.target.value);
                }}></input>
            </form>
            <button onClick={login}>Sign In</button>
        
        
        
        
        </div>

    );
    

};

export default LogIn;
