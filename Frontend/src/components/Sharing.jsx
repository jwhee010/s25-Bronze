import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sharing.css";

export default function Sharing() {
    const [foodItems, setFoodItems] = useState([]);
    const [friendsSharing, setfriendsSharing] = useState([]);
    const [friendsFoodRequests, setfriendsFoodRequests] = useState([]);
    const [sharedStatus, setSharedStatus] = useState({});
    const [requested, setRequested] = useState({});
    const [acceptRequest, setAcceptRequest] = useState({});
    const [yourSharedItems, setYourSharedItems] = useState([]);

    // Fetch user's food items and stores in an array to be displayed
    const showFoodItems = async (token) => {
        try {
            const response = await axios.get("http://localhost:80/sharing",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFoodItems(response.data.foodItems || []);
        } catch (error) {
            console.error("Error retrieving food items:", error);
        }
    };

    const getSharedFoodItems = async(token) => {
        try{
            const response = await axios.get("http://localhost:80/sharing/yourShared",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setYourSharedItems(response.data.yourSharedItems || []);
            console.log("this is your shared items", yourSharedItems);
        } catch (error) {
            console.log("Error retrieving your shared items", error);
        }
    }

    // Function gets the food items that shelf friends have set as shareable
    const getFriendsFood = async(token) => {
        try{
            const response = await axios.get("http://localhost:80/friendsSharing",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                setfriendsSharing(response.data.friendsSharing);
                console.log("Friends data", response.data.friendsSharing);
            } else {
                console.warn("friendsSharing is missing in the response");
                setfriendsSharing([]);
            }
        } catch(error){
            console.error("Error retrieving friends food items:", error);
        }
    };

    // functions gets the requests friends have made of the food that has been made shareable
    const getFoodRequset = async(token) =>{
        try{
            const response = await axios.get("http://localhost:80/friendsFoodRequests",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data){
                setfriendsFoodRequests(response.data.friendsFoodRequests);
                console.log("Friends requesting your food", response.data.friendsFoodRequests);
            } else {
                console.warn("Food request not retrieved");
                setfriendsFoodRequests([]);
            }
        } catch(error){
            console.error("Error retriving food requests", error)
        }
    };


    useEffect(() => {
        const token = localStorage.getItem("authToken");
        

        if (token) {
            
            showFoodItems(token);
            getSharedFoodItems(token);
            getFriendsFood(token);
            getFoodRequset(token);
        } else {
            console.log("token not retrieved");
        }
    }, []);

    useEffect(() => {
        if (foodItems.length > 0 && yourSharedItems.length > 0) {
            const status = {};
    
            foodItems.forEach((item, index) => {
                const isShared = yourSharedItems.some(shared =>
                    shared.InventoryItemID === item.inventoryID
                );
                status[index] = isShared;
            });
    
            setSharedStatus(status);
        }
    }, [foodItems, yourSharedItems]);
    
    
    

    // this is to see if the functions are being ran when the button is pressed
    const runWhenTrue = (index) => {
        console.log(`Item ${index} is now shared.`);
    };
    
    const runWhenFalse = (index) => {
        console.log(`Item ${index} is no longer shared.`);
    };

    //these function will send the food information to the server to be inserted to the shared_food table
    const shareItemToServer = async (token, item) => {
    console.log(`item to share`, item);

    if (!item) {
        console.log('Item is undefined or null!');
        return;
    }
    
    try {
        const response = await axios.post('http://localhost:80/Sharing/ShareFood',
            {
                InventoryItemID: item.inventoryID,
                AvailableQuantity: item.Quantity,
                Status: item.ExpirationStatus
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Item shared successfully:", response.data.message);
    } catch (error) {
        console.error('Error sharing food', error);
    }
};


    const unshareItemFromServer = async (token, item) => {
        try{
            const response = await axios.delete('http://localhost:80/Sharing/UnShareFood',
            {
                data: {
                    InventoryItemID: item.inventoryID // ensure this matches your object
                },
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }  
            });
            console.log(`This item is deleted to be deleted:`, item);
        } catch (error){
            console.error('error deleting food', error);
        }
    };


    const toggleShare = (index, item) => {
        const token = localStorage.getItem("authToken");

        setSharedStatus((prevStatus) => {
            const newStatus = !prevStatus[index];
    
            if (newStatus) {
                runWhenTrue(index);
                shareItemToServer(token, item);
            } else {
                runWhenFalse(index);
                unshareItemFromServer(token, item);
            }
    
            return {
                ...prevStatus,
                [index]: newStatus,
            };
        });
    };
    
    
    // Function is used to toogle the reqeust and cancel requset
    const toggleRequest = (index) => {
        setRequested((prevRequested) => ({
          ...prevRequested,
          [index]: !prevRequested[index], // Toggle the request status for this friend
        }));
      };

    // function is used to toggle the accpet request for food items that shelffriends have requested
    const toggleAccept = (index) =>{
        setAcceptRequest((prevStatus) => ({
            ...prevStatus,
            [index]: !prevStatus[index], 
        }));
    }

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
                            <th>Share</th>
                        </tr>
                    </thead>
                    <tbody>
    {foodItems.map((item, index) => (
        <tr key={index}>
            <td>{item.FoodName}</td>
            <td>{item.Quantity}</td>
            <td>{item.ExpirationStatus}</td>
            <td>
                <button
                    type="button"
                    onClick={() => toggleShare(index, item)}
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

    {friendsSharing.length > 0 ? (
        <table className="table-container">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Food Name</th>
                    <th>Available Quantity</th>
                    <th>Expiration Status</th>
                    <th>Request Food</th>
                </tr>
            </thead>
            <tbody>
                {friendsSharing.map((item, index) => (
                    <tr key={index}>
                        <td>{`${item.firstName} ${item.lastName} (${item.userName})`}</td>
                        <td>{item.FoodName}</td>
                        <td>{`${item.AvailableQuantity} ${item.DefaultUnit}`}</td>
                        <td>{item.Status}</td>
                        <td>
                        <button 
                        type = "button" 
                        onClick={() => toggleRequest(index)}
                        style={{
                            backgroundColor: requested[index] ? "red" : "green",
                            color: "white",
                            padding: "5px 10px",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "5px",
                            width: "80px",
                            textAlign: "center"
                        }}>
                        {requested[index] ? "Cancel" : "Request"} {/* Button Text */}
                        </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>No shared food items available.</p>
    )}
    
    <h3>Food Requests</h3>

    {friendsFoodRequests.length > 0 ? (<table className="table-container">
        <thead>
            <tr>
                <th>Name</th>
                <th>Food Name</th>
                <th>Quantity Requested</th>
                
                <th>Expiration Status</th>
                <th>Accept Request</th>
            </tr>
        </thead>
        <tbody>
            {friendsFoodRequests.map((item, index) => (
                <tr key={index}>
                    <td>{`${item.firstName} ${item.lastName} (${item.userName})`}</td>
                    <td>{item.FoodName}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.Status}</td>
                    <td><button type="button">Accept</button></td>
                </tr>
            ))}
        </tbody>
    </table>) : (
        <p>No Requests</p>
    )}
</div>
    );
}
