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






///////////////////////////////////////////////correct one
import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Messaging.css";

const socket = io("http://localhost:3000"); // Replace with your server address

function Messaging() {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    const handleScroll = () => {
        const element = document.getElementById('content');
        element.scrollIntoView();
    };

    useEffect(() => {
        // Socket.IO event listeners

        // Listen for incoming messages
        socket.on("message", (message) => {
            setMessages([...messages, message]);
            // setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            // Cleanup on component unmount
            socket.off("message");
        };
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if (messageInput.trim() !== "") {
            const message = { 
                id: socket.id,
                text: messageInput, 
                timestamp: new Date() 
            };
            socket.emit("message", message);
            setMessageInput("");
        }
    };


///////////////////////////////////////////////////////////////////////////////
// function sendMessage(e) {
//     e.preventDefault()
//     const input = document.querySelector('input')
//     if (input.value){
//         socket.emit('message', input.value )
//         input.value = ""
//     }
//     input.foucs()
// }
// document.querySelector('form')
//     .addEventListener('submit', sendMessage)

// socket.on("message", ({message}) => {
//     const li = document.createElement('li')
//     li.textContent = message
//     document.querySelector('ul').appendChild(li)
// }

/////////////////////////////////////////////////////////////////////////////// 
//     return (
        
//         <div className="card">
//             <div className="flex flex-col h-full">
//                 <div className="message-list">
//                     {messages.map((msg, index) => (
//                         <div key={index} className="message-item">
//                             <div className="message-text">{msg.text}</div>
//                             <span className="message-timestamp">
//                                 {new Date(msg.timestamp).toLocaleTimeString()}
//                             </span>
//                         </div>
//                     ))}
//                 </div>
//                 <div className="input-section">
//                     <div className="message-input">
//                         <input
//                             type="text"
//                             className="input-field"
//                             placeholder="Type your message..."
//                             value={messageInput}
//                             onChange={(e) => setMessageInput(e.target.value)}
//                         />
//                         <button
//                             className="send-button"
//                             onClick={sendMessage}
//                         >
//                             Send
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
        
//     );
// }

// export default Messaging;

//////////////////////////////////////////////////////////

    return (
     <div> 
        <div className="card">
            <div className="flex flex-col h-full">
                <div className="message-list">
                    {messages.map((message, index) => (
                        <div key={index} className="message-item">
                            <div className="message-text">{message.text}</div>
                            <span className="message-timestamp">
                            {new Date(message.timestamp).toLocaleTimeString()} - {message.id.substring(0, 5)}
                                
                            </span>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
        <div className="input-section">
            <div className="message-input">
                <input
                    type="text"
                    className="input-field"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage(e); // Call the sendMessage function when Enter is pressed
                        }
                    }}
                />
                    <button
                        className="send-button"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>  
    );
}

export default Messaging;

