import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FriendList.css'; // Optional: create your own styling file

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState('');
  const [message, setMessage] = useState('');
 
  // Fetch friends on component mount
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

  useEffect(() => {

    const token = localStorage.getItem('authToken'); // Make sure you store the JWT here

    if(token){
      fetchFriends(token);
      console.log("Updated friends stated:", friends);
    } else {
      console.log("no token found");
    }
  }, []);

  
  // Add a frienddd
  const handleAddFriend = (e) => {
    e.preventDefault();

    axios.post('/friends/add', { friendId }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setMessage(res.data.message);
      setFriendId('');
      fetchFriends(); // Refresh list
    })
    .catch(err => {
      setMessage(err.response?.data?.error || 'Error adding friend');
    });
  };

  // Remove a friend
  const handleRemoveFriend = (id) => {
    axios.delete('/friends/remove', {
      headers: { Authorization: `Bearer ${token}` },
      data: { friendId: id }
    })
    .then(res => {
      setMessage(res.data.message);
      fetchFriends(); // Refresh list
    })
    .catch(err => {
      setMessage(err.response?.data?.error || 'Error removing friend');
    });
  };


  return (
    <div className="friend-list-container">
      <h2>My Friends</h2>

      {message && <p>{message}</p>}

      <ul>
        {friends.map((item, index)=> (
          <li key={index}>
            {item.firstName} {item.lastName} ({item.userName})
            <button onClick={() => handleRemoveFriend(friends.user_id)}>Remove</button>
          </li>
        ))}
      </ul>
      
      <form onSubmit={handleAddFriend}>
        <input
          type="number"
          placeholder="Enter Friend ID"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          required
        />
        <button type="submit">Add Friend</button>
      </form>
    
    </div>
  );
}
