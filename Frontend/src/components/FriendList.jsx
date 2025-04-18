import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Navigate hook
import "./FriendList.css";

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

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

    if (token) {
      fetchFriends(token);
    } else {
      console.log("no token found");
    }
  }, []);

  const addFriend = () => {
    const token = localStorage.getItem('authToken');
    axios.post(
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
        setErrorMessage("");
        fetchFriends(token); // Refresh the list without full page reload
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "An error occurred when adding a friend.";
        setErrorMessage(errorMessage);
        console.error("Error adding friend:", errorMessage);
      });
  };

  const removeFriend = (friendId) => {
    const token = localStorage.getItem('authToken');

    console.log("Sending remove request for friendId:", friendId);
    axios.post(
      "http://localhost:80/friends/remove",
      { UserID_2: Number(friendId) },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    )
      .then(() => {
        console.log(`Friend ${friendId} removed`);
        fetchFriends(token); // Refresh the list without full page reload
        setErrorMessage("");
      })
      .catch((error) =>
        console.error("Error removing friend:", error.message)
      );
  };

  return (
    <div className="friend-list-container">
      <h2>Your Friends</h2>
      <ul>
        {friends.map((item, index) => {
          console.log("Friend item:", item);
          return (
            <li key={index}>
              <span className="friend-name">
                {item.firstName} {item.lastName} ({item.userName})
              </span>
              <div className="friend-buttons">
                <button onClick={() => goToMessagePage(item.userName)}>
                  Message
                </button>
                <button onClick={() => removeFriend(item.UserID)}>Remove</button>
              </div>
            </li>);

        })}
      </ul>
      <input
        type="text"
        placeholder="Enter friend ID"
        value={newFriend}
        onChange={(e) => setNewFriend(e.target.value)}
      />
      <button onClick={addFriend}>Add Friend</button>
      {errorMessage && <div className="error-message">
        {errorMessage}
      </div>}
    </div>
  );
}
