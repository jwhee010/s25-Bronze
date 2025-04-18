import React, { useState } from "react";
import Navbar from "./Navbar";
import "./Settings.css"; // Import the CSS file for styling

const Settings = () => {
  // State variables to manage user input
  const [email, setEmail] = useState(""); // State for the new email
  const [firstName, setFirstName] = useState(""); // State for the first name
  const [lastName, setLastName] = useState(""); // State for the last name
  const [friendIdToAdd, setFriendIdToAdd] = useState(""); // State for the friend ID to add
  const [friendIdToRemove, setFriendIdToRemove] = useState(""); // State for the friend ID to remove

  // Function to handle email change
  const handleChangeEmail = async () => {
    try {
      const response = await fetch("/api/user/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token for authentication
        },
        body: JSON.stringify({ email }), // Send the new email in the request body
      });
      if (response.ok) {
        alert("Email updated successfully!"); // Notify the user on success
      } else {
        alert("Failed to update email."); // Notify the user on failure
      }
    } catch (error) {
      console.error("Error updating email:", error); // Log any errors
    }
  };

  // Function to handle name change
  const handleChangeName = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token for authentication
        },
        body: JSON.stringify({ firstName, lastName }), // Send the new names in the request body
      });
      if (response.ok) {
        alert("Name updated successfully!"); // Notify the user on success
      } else {
        alert("Failed to update name."); // Notify the user on failure
      }
    } catch (error) {
      console.error("Error updating name:", error); // Log any errors
    }
  };

  // Function to handle adding a friend
  const handleAddFriend = async () => {
    try {
      const response = await fetch("/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token for authentication
        },
        body: JSON.stringify({ friendId: friendIdToAdd }), // Send the friend ID in the request body
      });
      if (response.ok) {
        alert("Friend added successfully!"); // Notify the user on success
      } else {
        alert("Failed to add friend."); // Notify the user on failure
      }
    } catch (error) {
      console.error("Error adding friend:", error); // Log any errors
    }
  };

  // Function to handle removing a friend
  const handleRemoveFriend = async () => {
    try {
      const response = await fetch("/friends/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Include the token for authentication
        },
        body: JSON.stringify({ friendId: friendIdToRemove }), // Send the friend ID in the request body
      });
      if (response.ok) {
        alert("Friend removed successfully!"); // Notify the user on success
      } else {
        alert("Failed to remove friend."); // Notify the user on failure
      }
    } catch (error) {
      console.error("Error removing friend:", error); // Log any errors
    }
  };

  return (
    <div className="settings-container">
      <h1>Settings</h1> {/* Page title */}

      <div className="table-container">
        {/* Section for updating email */}
        <div>
          <h3>Update Email</h3>
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
          />
          <button onClick={handleChangeEmail}>Change Email</button>
        </div>

        {/* Section for updating name */}
        <div>
          <h3>Update Name</h3>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} // Update state on input change
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} // Update state on input change
          />
          <button onClick={handleChangeName}>Change Name</button>
        </div>

        {/* Section for managing friends */}
        <div>
          <h3>Manage Friends</h3>
          <input
            type="text"
            placeholder="Friend ID to Add"
            value={friendIdToAdd}
            onChange={(e) => setFriendIdToAdd(e.target.value)} // Update state on input change
          />
          <button onClick={handleAddFriend}>Add Friend</button>
          <input
            type="text"
            placeholder="Friend ID to Remove"
            value={friendIdToRemove}
            onChange={(e) => setFriendIdToRemove(e.target.value)} // Update state on input change
          />
          <button onClick={handleRemoveFriend}>Remove Friend</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;