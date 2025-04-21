import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from 'axios'; // Use axios for API requests
import "./Settings.css";

const Settings = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const token = localStorage.getItem("authToken"); // Retrieve token once

  // Function to handle email change
  const handleChangeEmail = async () => {
    try {
      const response = await axios.put(
        "http://localhost:80/api/user/email",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data); // Log response for debugging
      alert("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error.response?.data || error.message);
      alert("Failed to update email.");
    }
  };

  // Function to handle name change
  const handleChangeName = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:80/api/user/profile",
        { firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data); // Log response for debugging
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error.response?.data || error.message);
      alert("Failed to update name.");
    }
  };

  // Function to handle emptying inventory
  const handleEmptyInventory = async () => {
    try {
      const response = await axios.delete("http://localhost:80/api/inventory/empty", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data); // Log response for debugging
      alert("Inventory emptied successfully!");
    } catch (error) {
      console.error("Error emptying inventory:", error.response?.data || error.message);
      alert("Failed to empty inventory.");
    }
  };

  // Function to handle resetting analytics
  const handleResetAnalytics = async () => {
    try {
      const response = await axios.post("http://localhost:80/api/analytics/reset", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data); // Log response for debugging
      alert("Analytics reset successfully!");
    } catch (error) {
      console.error("Error resetting analytics:", error.response?.data || error.message);
      alert("Failed to reset analytics.");
    }
  };

  return (
    <div className="settings-container">
      <Navbar />
      <h1>Settings</h1>

      <div className="table-container">
        <div>
          <h3>Update Email</h3>
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleChangeEmail}>Change Email</button>
        </div>

        <div>
          <h3>Update Name</h3>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button onClick={handleChangeName}>Change Name</button>
        </div>

        <div>
          <h3>Empty Inventory</h3>
          <button onClick={handleEmptyInventory}>Empty Inventory</button>
        </div>

        <div>
          <h3>Reset Analytics</h3>
          <button onClick={handleResetAnalytics}>Reset Analytics</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;