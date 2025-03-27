import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sharing.css";

export default function Sharing() {
    const [foodItems, setFoodItems] = useState([]);
    const [friendsSharing, setfriendsSharing] = useState([]);
    const [sharedStatus, setSharedStatus] = useState({});

    // Fetch user's food items and stores in an array to be displayed
    const showFoodItems = async (token) => {
        try {
            const response = await axios.get("http://localhost:80/sharing", 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Food items retrieved", response.data.foodItems);
            setFoodItems(response.data.foodItems || []);
        } catch (error) {
            console.error("Error retrieving food items:", error);
        }
    };

    const getFriendsFood = async(token) => {
        try{
            const response = await axios.get("http://localhost:80/friendsSharing",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Friends Items retrieved", response.data);
            setfriendsSharing(response.data || []);
        } catch(error){
            console.error("Error retrieving friends food items:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (token) {
            showFoodItems(token);
            getFriendsFood(token);
        }
    }, []);

    // Function to toggle share/cancel
    const toggleShare = (index) => {
        setSharedStatus((prevStatus) => ({
            ...prevStatus,
            [index]: !prevStatus[index] // Toggle between true and false
        }));
    };

    return (
        <div>
            <h3>Share your food</h3>
            
            {foodItems.length > 0 ? (
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>Expiration Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.FoodName}</td>
                                <td>{item.Quantity}</td>
                                <td>{item.ExpirationStatus}</td>
                                < td>
                                    <button
                                        type="button"
                                        onClick={() => toggleShare(index)}
                                        style={{
                                            backgroundColor: sharedStatus[index] ? "red" : "green",
                                            color: "white",
                                            padding: "5px 10px",
                                            border: "none",
                                            cursor: "pointer",
                                            borderRadius: "5px",
                                            width: "80px",
                                            textAlign: "center"
                                        }}
                                    >
                                        {sharedStatus[index] ? "Cancel" : "Share"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No food items available</p>
            )}
            
        <h3>Requesut friends food</h3>
        </div>
    );
}
