import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FriendList.css'; // Optional: create your own styling file

export default function FriendList() {
  const [friends, setFriends] = useState([]);
  const [friendId, setFriendId] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token'); // Make sure you store the JWT here

  // Fetch friends on component mount
  const fetchFriends = () => {
    axios.get('/friends', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setFriends(res.data))
    .catch(err => console.error('Error fetching friends:', err));
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Add a friend
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
        {friends.map(friend => (
          <li key={friend.user_id}>
            {friend.name} ({friend.email})
            <button onClick={() => handleRemoveFriend(friend.user_id)}>Remove</button>
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
