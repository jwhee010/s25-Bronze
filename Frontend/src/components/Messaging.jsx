import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ShelfFriends = () => {
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState("");
    
    useEffect(() => {
        // Listen for 'receiveMessage' event from the backend
        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup listener on component unmount
        return () => {
            socket.off('receiveMessage');
        };
    }, []);
    
    const sendMessage = () => {
        if (newMessage.trim()) {
            // Emit the message to the backend
            socket.emit('sendMessage', {
                content: newMessage,
                timestamp: new Date().toISOString(), // Optional metadata
            });

            // Optimistically add the message to the local state
            setMessages((prevMessages) => [...prevMessages, { content: newMessage }]);

            // Clear the input field
            setNewMessage('');
        }
    };

    const ShelfFriends = () => {
        const [messages, setMessages] = React.useState([]);
        const [newMessage, setNewMessage] = React.useState("");
        
        useEffect(() => {
            // Listen for 'receiveMessage' event from the backend
            socket.on('receiveMessage', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
    
            // Cleanup listener on component unmount
            return () => {
                socket.off('receiveMessage');
            };
        }, []);
        
        const sendMessage = () => {
            if (newMessage.trim()) {
                // Emit the message to the backend
                socket.emit('sendMessage', {
                    content: newMessage,
                    timestamp: new Date().toISOString(), // Optional metadata
                });
    
                // Optimistically add the message to the local state
                setMessages((prevMessages) => [...prevMessages, { content: newMessage }]);
    
                // Clear the input field
                setNewMessage('');
            }
        };
    
        return (
            <div>   
                <div className="Shelf-Friends">
                    <div className="message-list">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="message-item">
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <div className="message-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    };
}

export default Messaging;