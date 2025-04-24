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

    const formatTimestamp = (sqlTimestamp) => {
        const date = new Date(sqlTimestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
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
                        <div
                            key={index}
                            className={`message-item ${msg.senderID === senderID ? "user-message" : "receiver-message"}`}
                        >
                            <span className="message-sender">
                                {msg.senderID === senderID ? "You" : userName}:
                            </span>
                            <span className="message-text">{msg.text}</span>
                            <div className="message-time">{formatTimestamp(msg.timestamp)}</div> 
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