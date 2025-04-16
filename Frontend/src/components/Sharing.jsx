import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sharing.css";

export default function Sharing() {
    // save your food items data
    const [foodItems, setFoodItems] = useState([]);

    // data to see what food you've marked as shared
    const [yourSharedItems, setYourSharedItems] = useState([]);

    // save your friends shared food items data
    const [friendsSharing, setfriendsSharing] = useState([]);

    // saves the data of food items you've requested from your friends
    const [userFoodRequests, setUserFoodRequests] = useState([]);

    // saves your the data of food items your friends are requesting from you
    const [friendsFoodRequests, setfriendsFoodRequests] = useState([]);
    const [sharedStatus, setSharedStatus] = useState({});
    const [requested, setRequested] = useState({});
    

    // Fetch user's food items and stores in an array to be displayed
    const showFoodItems = async (token) => {
        try {
            const response = await axios.get("http://localhost:80/Sharing",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFoodItems(response.data.foodItems || []);
            console.log('THESE ARE YOUR ITEMS', response.data);
        } catch (error) {
            console.error("Error retrieving food items:", error);
        }
    };

    
    const getSharedFoodItems = async(token) => {
        try{
            const response = await axios.get("http://localhost:80/Sharing/yourShared",{
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
            const response = await axios.get("http://localhost:80/Sharing/Friends",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                console.log("food friends are sharing", response.data);
                setfriendsSharing(response.data.friendsSharing);
            } else {
                console.warn("friendsSharing is missing in the response");
                setfriendsSharing([]);
            }
        } catch(error){
            console.error("Error retrieving friends food items:", error);
        }
    };

    // gets the food items the user has requested from thier friends
    const getRequestedFoodItem = async(token) => {
        try{
            const response  = await axios.get('http://localhost:80/Sharing/getRequests', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("food items you've requested", response.data);
            setUserFoodRequests(response.data.userFoodRequests || []);
        } catch (error) {
            console.error("error requesting food item", error);
        }
    };



    // functions gets the requests friends have made of the food that has been made shareable
    const getFoodRequest = async(token) =>{
        try{
            const response = await axios.get("http://localhost:80/friendsFoodRequests",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data){
                setfriendsFoodRequests(response.data.friendsFoodRequests);
                console.log("FRIENDS FOOD REQUESTS", response.data.friendsFoodRequests);
            } else {
                console.warn("Food request not retrieved");
                setfriendsFoodRequests([]);
            }
        } catch(error){
            console.error("Error retriving food requests", error);
        }
    };

    const refreshAllData = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
    
        // Ensure foodItems and sharedItems are fetched before updating UI-dependent states
        await showFoodItems(token);          // get foodItems first
        await getSharedFoodItems(token);     // then get your shared items
        await getFoodRequest(token);         // update any pending requests
    };    




    useEffect(() => {
        const token = localStorage.getItem("authToken");
        

        if (token) {
            // get user food items
            showFoodItems(token);

            // get the food items set to share
            getSharedFoodItems(token);

            // get food items friends set to share
            getFriendsFood(token);

            // get the food you reqeusted from your friends
            getRequestedFoodItem(token);

            // get the requests of the item your friends want 
            getFoodRequest(token);
        } else {
            console.log("token not retrieved");
        }
    }, []);

    // sets buttons for the user to properly share and unshare food its
    useEffect(() => {
        if (foodItems.length && yourSharedItems.length >= 0) {
            const status = {};
    
            foodItems.forEach((item, index) => {
                const isShared = yourSharedItems.some(shared =>
                    shared.InventoryItemID === item.InventoryID
                );
                status[index] = isShared;
            });
    
            setSharedStatus(status);
        }
    }, [foodItems, yourSharedItems]);

    // sets buttons properly so that the user can properly request and unrequest food items
    useEffect(() => {
        if (friendsSharing.length > 0 && userFoodRequests.length > 0) {
            const status = {};
    
            friendsSharing.forEach((item, index) => {
                const isRequested = userFoodRequests.some(requested =>
                    requested.SharedItemID === item.SharedItemID
                );
                status[index] = isRequested;
            });
    
            setRequested(status);
        }
    }, [friendsSharing, userFoodRequests]);
    
    
    


    // this is to see if the functions are being ran when the button is pressed
    const runWhenTrue = (index) => {
        console.log(`Item ${index} is now shared.`);
    };
   
    const runWhenTrueR = (index) => {
        console.log(`Item ${index} is now requested.`);
    };
    
    
    const runWhenFalse = (index) => {
        console.log(`Item ${index} is no longer shared.`);
    };

    const runWhenFalseR = (index) => {
        console.log(`Item ${index} is no longer requested.`);
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
                InventoryItemID: item.InventoryID,
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
        await getSharedFoodItems(token);
    } catch (error) {
        console.error('Error sharing food', error);
    }
};

    /// unshares your food item
    const unshareItemFromServer = async (token, item) => {
        try{
            const response = await axios.delete('http://localhost:80/Sharing/UnShareFood',
            {
                data: {
                    InventoryItemID: item.InventoryID // ensure this matches your object
                },
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log(`This item is deleted to be deleted:`, item);
            await getSharedFoodItems(token);
            await getFoodRequest(token);
        } catch (error){
            console.error('error deleting food', error);
        }
    };

    // sends a request to your friend for their food item
    const requestAFoodItem = async (token, item) => {
        try{
            const response = await axios.post('http://localhost:80/Sharing/sendRequest',{
                SharedItemID: item.SharedItemID,
                Status: item.ExpirationStatus
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
        } catch (error) {
            console.error('Error requesting food', error);
        };
    };

    const deleteARequest = async (token, item) => {
        try{
            const response = await axios.delete('http://localhost:80/Sharing/unRequest',
            {
                data: {
                    SharedItemID: item.SharedItemID
                },
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            console.log("sent request for", item);
        } catch (error) {
            console.error("error deleting request", error);
        }  
    };

    const acceptRequest = async (token, item) => {
        try{
            const response = await axios.post('http://localhost:80/Sharing/AcceptRequest',
                {
                    RequestorUserID: item.RequestorUserID,
                    InventoryID: item.InventoryID,
                    SharedItemID: item.SharedItemID
                },{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
                console.log("Food item to accept")
        } catch (error) {
            console.error('error accepting request', error);
        }
    };

    // handles the sharing button states and functions
    const toggleShare = async (index, item) => {
        const token = localStorage.getItem("authToken");


        const newStatusS = !sharedStatus[index];

        if (newStatusS) {
            runWhenTrue(index);
            await shareItemToServer(token, item);
        } else {
            runWhenFalse(index);
            await unshareItemFromServer(token, item);
        }
        
        setSharedStatus((prevStatus) => ({
            ...prevStatus,
            [index]: newStatusS,
        }));
    };
    
    
    // Function is used to toogle the reqeust and cancel requset
    const toggleRequest = async (index, item) => {
        const token = localStorage.getItem("authToken");
    
        const newStatus = !requested[index];
    
        if (newStatus) {
            runWhenTrueR(index); // Optional
            await requestAFoodItem(token, item);
        } else {
            runWhenFalseR(index); // Optional
            await deleteARequest(token, item);
        }
    
        // Update UI status
        setRequested((prevRequested) => ({
            ...prevRequested,
            [index]: newStatus,
        }));
    
        // Optionally refresh userFoodRequests so UI reflects changes from DB
        getRequestedFoodItem(token);
    };
    

    // function is used to toggle the accpet request for food items that shelffriends have requested
    const toggleAccept = async (item) => {
        const token = localStorage.getItem("authToken");
    
        if (token) {
            console.log("this is the item to accept", item.InventoryID, item.RequestorUserID);
    
            // Accept the request
            await acceptRequest(token, item);
    
            // Unshare the item after
            await unshareItemFromServer(token, item);
    
            // Optionally refresh data here, if needed
            await refreshAllData();
        } else {
            console.log("no token provided");
        }
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
                        onClick={() => toggleRequest(index, item)}
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
                <th>Shared Item Id</th>
                <th>Accept Request</th>
            </tr>
        </thead>
        <tbody>
            {friendsFoodRequests.map((item, index) => (
                <tr key={index}>
                    <td>{`${item.firstName} ${item.lastName} (${item.userName})`}</td>
                    <td>{item.FoodName}</td>
                    <td>{item.Quantity}</td>
                    <td>{item.SharedItemID}</td>
                    <td><button type="button" onClick={() => toggleAccept(item)}>Accept</button></td>
                </tr>
            ))}
        </tbody>
    </table>) : (
        <p>No Requests</p>
    )}
</div>
    );
}
