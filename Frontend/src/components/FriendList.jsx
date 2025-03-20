import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    const [newFriend, setNewFriend] = useState('');

    // 🔹 Fetch friends from the backend
    useEffect(() => {
        axios.get('http://localhost:80/friends', {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        })
        .then(response => setFriends(response.data))
        .catch(error => console.error('Error fetching friends:', error));
    }, []);

    // 🔹 Add a new friend
    const addFriend = () => {
        axios.post('http://localhost:80/friends/add', { friendId: newFriend }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        })
        .then(() => {
            setNewFriend('');
            window.location.reload();  // Refresh the list
        })
        .catch(error => console.error('Error adding friend:', error));
    };

    // 🔹 Remove a friend
    const removeFriend = (friendId) => {
        axios.delete(`http://localhost:80/friends/remove?friendId=${friendId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        })
        .then(() => window.location.reload())
        .catch(error => console.error('Error removing friend:', error));
    };

    return (
        <div>
            <h2>Your Friends</h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.name} 
                        <button onClick={() => removeFriend(friend.id)}>Remove</button>
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
