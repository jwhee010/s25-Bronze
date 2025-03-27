// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// // import "./ShelfFriends.css";
//import "./Messaging.css";

// const socket = io("http://localhost:3000");

// const Messaging = () => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");

//     useEffect(() => {
//         // Listen for 'receiveMessage' event from the backend
//         socket.on("receiveMessage", (message) => {
//             setMessages((prevMessages) => [...prevMessages, message]);
//             //setMessages([...messages, message]);
//         });

//         // Cleanup listener on component unmount
//         return () => {
//             socket.off("receiveMessage");
//         };
//     }, []);

//     const sendMessage = () => {
//         if (newMessage.trim()) {
//             // Emit the message to the backend
//             socket.emit("sendMessage", {
//                 content: newMessage,
//                 timestamp: new Date().toISOString(), // Optional metadata
//             });

//             // Optimistically add the message to the local state
//             setMessages((prevMessages) => [...prevMessages, { content: newMessage }]);

//             // Clear the input field
//             setNewMessage("");
//         }
//     };

//     return (
//         <div className="messaging">
//             <div className="message-list">
//                 {messages.map((msg, idx) => (
//                     <div key={idx} className="message-item">
//                         {msg.content}
//                     </div>
//                 ))}
//             </div>
//             <div className="message-input">
//                 <input
//                     type="text"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type your message..."
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default Messaging;

///////////////////////////////////////////////
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your server address

function Messaging() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");



    useEffect(() => {
        // Socket.IO event listeners

        // Listen for incoming messages
        socket.on("message", (message) => {
            setMessages([...messages, message]);
        });

        return () => {
            // Cleanup on component unmount
            socket.off("message");
        };
    }, [messages]);

    const sendMessage = () => {
        if (messageInput.trim() !== "") {
            const message = { text: messageInput, timestamp: new Date() };
            socket.emit("message", message);
            setMessageInput("");
        }
    };

    return (
        <div className="flex justify-center items-center w-full h-screen bg-gradient-to-b from-blue-300 to-blue-200">
            <div className="bg-white rounded-lg w-96 h-96 p-4 shadow-md">
                <div className="flex flex-col h-full">
                    <div className="flex-1 p-2 overflow-y-auto bg-gray-100 rounded-md">
                        {messages.map((msg, index) => (
                            <div key={index} className="flex flex-col items-start">
                                <div
                                    className="bg-blue-500 
                   text-white p-2 rounded-md"
                                >
                                    {msg.text}
                                </div>
                                <span className="text-gray-500 text-xs">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-300">
                        <div className="flex">
                            <input
                                type="text"
                                className="w-full px-2 py-1 border rounded-l-md outline-none"
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                                onClick={sendMessage}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Messaging;