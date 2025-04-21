// import "./MessagePage.css";

// import React, { useState, useEffect } from "react"; // Import useEffect for decoding the token
// import { useParams, useNavigate } from "react-router-dom"; // To access the route parameters
// import {jwtDecode} from "jwt-decode"; // Import jwt-decode

// const MessagePage = () => {
//   const navigate = useNavigate();
//   const { userName } = useParams(); // Extract userName from the URL (if passed)

//   const [messages, setMessages] = useState([]); // State to store messages
//   const [inputMessage, setInputMessage] = useState(""); // State to store the current input
//   const [senderUsername, setSenderUsername] = useState(""); // State to store the sender's username

//   // Decode the token to get the username
//   useEffect(() => {
//     const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
//     if (token) {
//       try {
//         const decoded = jwtDecode(token); // Decode the token
//         setSenderUsername(decoded.username); // Extract and set the username
//       } catch (err) {
//         console.error("Error decoding token:", err);
//       }
//     }
//   }, []);

//   // Navigation logic to go back or anywhere else
//   const goBackToFriendList = () => {
//     navigate("/shelfFriends"); // Adjust the route based on your setup
//     console.log("Returning to Friend List");
//   };

//   // Handle message input change
//   const handleInputChange = (event) => {
//     setInputMessage(event.target.value);
//   };

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (inputMessage.trim() !== "") {
//       const timestamp = new Date().toLocaleTimeString(); // Get the current time
//       const newMessage = { text: inputMessage, time: timestamp, sender: senderUsername }; // Use senderUsername
//       setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to the list
//       setInputMessage(""); // Clear the input field
//     }
//   };

//   return (
//     <div className="container">
//       {/* Top Bar */}
//       <div className="top-bar">
//         <div className="friend-name">{userName}:</div>
//         <button className="back-button" onClick={goBackToFriendList}>
//           Go Back
//         </button>
//       </div>

//       {/* Main Text List */}
//       <div className="content">
//         {/* Render Messages */}
//         <div className="message-list">
//           {messages.map((msg, index) => (
//             <div key={index} className="message-item">
//               <span className="message-sender">{msg.sender}: </span>
//               <span className="message-text">{msg.text}</span>
//               <div className="message-time">{msg.time}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="input-section">
//         <div className="message-input">
//           <input
//             type="text"
//             className="input-field"
//             placeholder="Type your message..."
//             value={inputMessage}
//             onChange={handleInputChange} // Update state as user types
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSendMessage(); // Call the sendMessage function when Enter is pressed
//               }
//             }}
//           />
//           <button className="send-button" onClick={handleSendMessage}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MessagePage;

//******************************************************************************* */


import "./MessagePage.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // For decoding JWT

const MessagePage = () => {
    const navigate = useNavigate();
    const { userName } = useParams(); // Get friend's username from URL
    const [messages, setMessages] = useState([]); // State for storing messages
    const [inputMessage, setInputMessage] = useState(""); // State for user input
    const [senderID, setSenderID] = useState(null); // State for sender's ID

    // Fetch token and decode sender's ID
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the token
                setSenderID(decoded.username || decoded.UserID); // Adjust based on your token's payload structure
                fetchMessages(decoded.username || decoded.UserID, userName); // Fetch messages on component mount
            } catch (err) {
                console.error("Error decoding token:", err);
            }
        } else {
            console.error("No token found.");
        }
    }, [userName]); // Dependency array ensures re-fetching when userName change

    // Fetch existing messages between the sender and receiver
    const fetchMessages = async (senderID, receiverID) => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await fetch(
                `http://localhost:80/messages?senderID=${senderID}&receiverID=${receiverID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the request
                    },
                }
            );
            const data = await response.json();
            setMessages(data); // Update state with fetched messages
        } catch (err) {
            console.error("Error fetching messages:", err);
        }
    };

    // Handle message input change
    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };

    // Handle sending a new message
    const handleSendMessage = async () => {
        if (inputMessage.trim() !== "") {
            const jsTimestamp = new Date();
            const mysqlTimestamp = jsTimestamp.toISOString().slice(0, 19).replace("T", " "); // Format to MySQL DATETIME

            const newMessage = {
                senderID,
                receiverID: userName,
                text: inputMessage,
                timestamp: mysqlTimestamp, // Use correctly formatted timestamp
            };

            // Update local state to show the new message
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            try {
                // Send the new message to the backend
                const token = localStorage.getItem("authToken");
                await fetch("http://localhost:80/messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newMessage),
                });
            } catch (err) {
                console.error("Error saving message:", err);
            }

            setInputMessage("");
        }
    };

    const goBackToFriendList = () => {
        navigate("/shelfFriends"); // Navigate back to the friend's list
    };

    return (
        <div className="container">
            {/* Top Bar */}
            <div className="top-bar">
                <div className="friend-name">Chat with {userName}:</div>
                <button className="back-button" onClick={goBackToFriendList}>
                    Go Back
                </button>
            </div>

            {/* Messages Section */}
            <div className="content">
                <div className="message-list">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-item">
                            <span className="message-sender">{msg.senderID === senderID ? "You" : userName}:</span>
                            <span className="message-text">{msg.text}</span>
                            <div className="message-time">{msg.timestamp}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Section */}
            <div className="input-section">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                    }}
                />
                <button className="send-button" onClick={handleSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessagePage;







//******************************************************************************** */


// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import {jwtDecode} from "jwt-decode";
// import { io } from "socket.io-client";

// import "./MessagePage.css";





// const MessagePage = () => {
//   const location = useLocation();
//   const { friendID } = location.state || {}; // Get the friend's ID from navigation state

//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState("");
//   const [senderID, setSenderID] = useState(null);

//   // Decode the token and set up the socket connection
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       const decoded = jwtDecode(token);
//       setSenderID(decoded.id); // Extract sender ID from the token

//       // Connect to Socket.IO server
//       const socketConnection = io("http://localhost:3000"); // Replace with your server address
//       setSocket(socketConnection);

//       // Join the private room
//       const roomName = [decoded.id, friendID].sort().join("-");
//       socketConnection.emit("joinRoom", { senderID: decoded.id, receiverID: friendID });

//       // Listen for incoming messages
//       socketConnection.on("receiveMessage", (data) => {
//         setMessages((prevMessages) => [...prevMessages, data]); // Append received message to the list
//       });

//       return () => {
//         socketConnection.disconnect(); // Cleanup the connection on component unmount
//       };
//     }
//   }, [friendID]);

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (socket && inputMessage.trim() !== "") {
//       const timestamp = new Date().toLocaleTimeString();
//       const roomName = [senderID, friendID].sort().join("-");
      
//       // Emit the message to the server
//       socket.emit("sendMessage", {
//         roomName,
//         senderID,
//         message: inputMessage,
//         timestamp,
//       });

//       // Update local message state
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { senderID, message: inputMessage, timestamp },
//       ]);
//       setInputMessage(""); // Clear input field
//     }
//   };

//   return (
//     <div className="container">
//       <div className="top-bar">
//         <div className="friend-name">{friendID}:</div>
//       </div>
      
//       <div className="content">
//         <div className="message-list">
//           {messages.map((msg, index) => (
//             <div key={index} className="message-item">
//               <span className="message-sender">
//                 {msg.senderID === senderID ? "You" : "Friend"}: 
//               </span>
//               <span className="message-text">{msg.message}</span>
//               <div className="message-time">{msg.timestamp}</div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="input-section">
//         <input
//           type="text"
//           className="input-field"
//           placeholder="Type your message..."
//           value={inputMessage}
//           onChange={(e) => setInputMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSendMessage();
//           }}
//         />
//         <button className="send-button" onClick={handleSendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessagePage;
