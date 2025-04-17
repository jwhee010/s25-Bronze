import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");

  const fetchFriends = () => {
    axios
      .get("http://localhost:80/friends", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        console.log("Friends fetched:", response.data);
        setFriends(response.data);
      })
      .catch((error) =>
        console.error("Error fetching friends:", error.message)
      );
  };

  useEffect(() => {
    fetchFriends(); // Load friends on mount
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
        {friends.map((friend) => (
          <li key={friend.UserID}>
            {friend.Username}{" "}
            <button onClick={() => removeFriend(friend.UserID)}>Remove</button>
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
