import React from "react";
import { useState } from 'react';
import Axios from "axios";
import './LogIn.css';



const LogIn = () => {

    const [userName, setUsername] = useState("");
    const [passwordHash, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [lastName, setLastName] = useState(""); 

    // await does not work outside an async function
    const login = async (event) => {
        event.preventDefault();
        // ** means its partially from roman's iteration of the code
        try {
            const response = await Axios.post("http://localhost:80/login", { // **
                userName: userName, // **
                passwordHash: passwordHash, // **
            });

            console.log(response); // **
            if (response.data.message) {
                //setMessage(response.data.message);
                setLastName(response.data.lastName);
                setMessage(`Login successful! Welcome Mr/Ms ${response.data.lastName}` );
            }
            else {
                setLastName(response.data.lastName);                                        // gotta change this
                setMessage(`Login successful! Welcome Mr/Ms ${response.data.lastName}` );   // gotta change this
            }
        } catch (error) {
            console.error("Some error happened:, ", error);
            setMessage("Sorry, something happened that caused an error.");
        }
    };

    /*
    const login = () => {
        Axios.post("http://localhost:80/login", {
            userName: userName,
            passwordHash: passwordHash,
        }).then((response) => {
            console.log(response);
        });
    };*/

    return (
        <div className='wrapper'>
            <h1 class = "hStyling">Sign In</h1>

            <form onSubmit={login}> {/* onSumbit allows for button or enter key */}
                <label>Username </label>
                <input type="text" required placeholder="Username" onChange={(e) => { {/* "required" prevents empty submission*/}
                    setUsername(e.target.value);
                    
                }}></input>
            </form>

            <form>
                <label>Password </label>
                <input type="password" required placeholder="Password" onChange={(e) => {
                    setPassword(e.target.value);
                }}></input>
            </form>

            <button class="button1" onClick={login}>Login</button> {/* Sumbit allows for button or enter key */}

            {/* this message changes depending upon what happened */}
            {/*{message && <p>{message}</p>}*/} {/* This is an output method im not sure about yet*/}
            <p>{message}</p>

          
            <button class = "button button2" onClick = {() => alert("Not Yet Implemented")} >
            Need an account? Click Here to Sign Up!
            </button>


        </div>
    );


};

export default LogIn;
