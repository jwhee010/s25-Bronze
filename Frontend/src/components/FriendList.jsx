import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Navigate hook

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const navigate = useNavigate(); 

  const fetchFriends = async (token) => {
    try {
    const response = await axios.get('http://localhost:80/friends', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Your friends list returns", response.data);
    setFriends(response.data.friends || []);
  } catch (error) {
    console.error("Error retrieving friends", error);
  }
};


   // Navigate to the MessagePage with the selected friend's ID
   const goToMessagePage = (userName) => {
    navigate(`/messagepage/${userName}`);
    console.log("Friend ID", userName);
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Make sure you store the JWT here
 
     if(token){
       fetchFriends(token);
       console.log("Updated friends stated:", friends);
     } else {
       console.log("no token found");
     }
  }, []);

  const addFriend = () => {
    axios
      .post(
        "http://localhost:80/friends/add",
        { friendId: newFriend },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then(() => {
        setNewFriend("");
        fetchFriends(); // Refresh the list without full page reload
      })
      .catch((error) => console.error("Error adding friend:", error));
  };

  const removeFriend = (friendId) => {
    console.log("Sending remove request for friendId:", friendId);
    axios
      .post(
        "http://localhost:80/friends/remove",
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then(() => {
        console.log(`Friend ${friendId} removed`);
        fetchFriends(); // Refresh the list without full page reload
      })
      .catch((error) =>
        console.error("Error removing friend:", error.message)
      );
  };

  return (
    <div>
      <h2>Your Friends</h2>
      <ul>
      {friends.map((item, index)=> (
           <li key={index}>
             {item.firstName} {item.lastName} ({item.userName})
             <button onClick={() => goToMessagePage(item.userName)}>
               Message
             </button>
             <button onClick={() => handleRemoveFriend(friends.user_id)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Enter friend ID"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
      />
      <button onClick={addFriend}>Add Friend</button>
    </div>
  );
}
