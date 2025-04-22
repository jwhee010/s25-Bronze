import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./settings.css";

const Settings = () => {
    const [newEmail, setNewEmail] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            alert('No authentication token found. Please log in.');
        }
    }, []);

    const handleChangeEmail = async () => {
        try {
            const response = await axios.post('http://localhost:80/settings/changeEmail', { newEmail });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Error changing email');
        }
    };

    const handleChangeName = async () => {
        try {
            const response = await axios.post('http://localhost:80/settings/changeName', { newFirstName, newLastName });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Error changing name');
        }
    };

    const handleEmptyInventory = async () => {
        try {
            const response = await axios.delete('http://localhost:80/settings/emptyInventory');
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Error emptying inventory');
        }
    };

    const handleResetAnalytics = async () => {
        try {
            const response = await axios.delete('http://localhost:80/settings/resetAnalytics');
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert('Error resetting analytics');
        }
    };

    return (
        <div className="settings-container">
            <Navbar />
            <h1 className="settings-header">Settings</h1>

            {/* Change Email Section */}
            <div className="settings-section">
                <h2 className="settings-section-header">Change Email</h2>
                <input
                    type="email"
                    className="settings-input"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                />
                <div className="settings-button-container">
                    <button className="settings-button" onClick={handleChangeEmail}>
                        Change Email
                    </button>
                </div>
            </div>

            <div className="settings-divider"></div>

            {/* Change Name Section */}
            <div className="settings-section">
                <h2 className="settings-section-header">Change Name</h2>
                <input
                    type="text"
                    className="settings-input"
                    placeholder="New First Name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                />
                <input
                    type="text"
                    className="settings-input"
                    placeholder="New Last Name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                />
                <div className="settings-button-container">
                    <button className="settings-button" onClick={handleChangeName}>
                        Change Name
                    </button>
                </div>
            </div>

            <div className="settings-divider"></div>

            {/* Empty Inventory Section */}
            <div className="settings-section">
                <h2 className="settings-section-header">Empty Inventory</h2>
                <div className="settings-button-container">
                    <button className="settings-button" onClick={handleEmptyInventory}>
                        Empty Inventory
                    </button>
                </div>
            </div>

            <div className="settings-divider"></div>

            {/* Reset Analytics Section */}
            <div className="settings-section">
                <h2 className="settings-section-header">Reset Analytics</h2>
                <div className="settings-button-container">
                    <button className="settings-button" onClick={handleResetAnalytics}>
                        Reset Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;