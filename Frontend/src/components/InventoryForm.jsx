import { useState, useEffect } from "react";
import "./InventoryForm.css";
import axios from "axios";
import { common } from "@mui/material/colors";

export default function InventoryForm({addNotification}) {
    const [active, setActive] = useState(false); // For Add Form
    const [activeRemove, setActiveRemove] = useState(false); // For Remove Form
    const [commonlyWasted, setCommonlyWasted] = useState([]);

    // Retrieve top 5 wasted food from the database, originally done by Jaylen
    const getWastedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/topWaste', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const wastedFood = response.data.foodItems.map((item, index) => ({
                id: index,
                value: item.Quantity,
                label: item.FoodName
            }));

            setCommonlyWasted(wastedFood);
        } catch (error) {
            console.error("Error retrieving food items:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        try {
            getWastedFood(token);
        } catch (error) {
            console.error("Token decoding error:", error);
        }
    }, []);

    // Compare foodName from the input form to commonly wasted food items
    function checkIfWasted(commonlyWasted, foodName) {
        for (let i = 0; i < commonlyWasted.length; i++) {
            if (commonlyWasted[i].label.toLowerCase() === foodName.toLowerCase()) {
                return true;
            }
        }

        return false;
    }

    const [inventoryFormData, setInventoryFormData] = useState({
        itemName: "",
        itemQuantity: "",
        purchaseDate: "",
        stored: "",
    });

    const [removeFormData, setRemoveFormData] = useState({
        foodName: "",
        itemQuantity: "",
        expirationDate: "",
    });

    // Open/Close Add Form
    function openItem() {
        setActive(true);
    }
    function closeItem() {
        setActive(false);
    }

    // Open/Close Remove Form
    function openRemoveForm() {
        setActiveRemove(true);
    }
    function closeRemoveForm() {
        setActiveRemove(false);
    }

    // Stores the user's inputted values
    const storeInput = (e) => {
        const { id, value, type, checked } = e.target;
        // The ... copies all of the previous data into the new data
        setInventoryFormData((prevData) => ({
            ...prevData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    // Store input values for Remove form
    const handleRemoveInput = (e) => {
        const { id, value } = e.target;
        setRemoveFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // Submit Add Form with Updated Logic
    const submitForm = async (e) => {
    e.preventDefault();

        try {
            let messages = [];

            const foodName = inventoryFormData.itemName;
            
            const isWasted = checkIfWasted(commonlyWasted, foodName); 

            // Alerts user if a food item is commonly wasted on form submission
            if(isWasted) {
                messages.push(`"${foodName}" is a commonly wasted food item, be mindful of your waste!`);
            }

            const token = localStorage.getItem("authToken");

            const ownedItemsRes = await axios.get('http://localhost:80/itemName', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const ownedItems = ownedItemsRes.data.itemNames.map(name => name.toLowerCase());
    
            if (ownedItems.includes(foodName.toLowerCase())) {
                messages.push(`You already have "${foodName}" in your inventory.`);
            }

            const response = await axios.post(
                "http://localhost:80/addOrUpdateFood",
                {
                    InventoryID: null,
                    UserID: token.UserID,
                    FoodName: inventoryFormData.itemName, // the addOrUpdateFood function maps the itemName to its ID.
                    PurchaseDate: inventoryFormData.purchaseDate,
                    Quantity: parseInt(inventoryFormData.itemQuantity),
                    
                    Storage: inventoryFormData.stored,
                    ExpirationStatus: "fresh",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            messages.forEach(msg => addNotification(msg));
        // Debug log for response
        console.log("Response Data:", response.data);

        // Notify user of success
        alert("Food item added or updated successfully!");
        closeItem();
        window.location.reload();
    } catch (error) {
        // Handle specific errors
        if (error.message === "No token found in localStorage. Please log in first.") {
            alert("You are not logged in! Please log in to proceed.");
        } else if (error.response) {
            console.error("Backend Error Response:", error.response.data);
            console.error("Status Code:", error.response.status);
            alert(`Failed to add food item: ${error.response.data.message}`);
        } else if (error.request) {
            console.error("Request Error: No response received from server.", error.request);
            alert("Failed to connect to the server. Please try again later.");
        } else {
            console.error("Unexpected Error:", error.message);
            alert("An unexpected error occurred. Please try again.");
        }
    }
};


const submitRemoveForm = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('authToken');

        // Remove item from inventory
        const removeResponse = await axios.post(
            'http://localhost:80/removeFoodQuantity',
            {
                FoodName: removeFormData.foodName,
                Quantity: parseInt(removeFormData.itemQuantity),
                ExpirationDate: removeFormData.expirationDate,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert('Food removal recorded successfully!');
        console.log('Response:', removeResponse.data);
        closeRemoveForm();
        window.location.reload();
    } catch (error) {
        console.error('Error removing food item:', error);
        alert('Failed to remove food item.');
    }
};

    // Final JSX structure with buttons and forms
    return (
        <div className="formbutton">
            <div className="button-container add-container">
                <button className="invbutton" onClick={() => setActive(true)}>
                    Add to Inventory
                </button>
                {active && (
                    <div className="open add-form">
                        <form id="inputToInventory" onSubmit={submitForm}>
                            <label htmlFor="itemName">Item Name</label>
                            <input
                                type="text"
                                id="itemName"
                                value={inventoryFormData.itemName}
                                onChange={storeInput}
                                required
                            />
                            <br />
                            <label htmlFor="itemQuantity">Item Quantity</label>
                            <input
                                type="number"
                                id="itemQuantity"
                                value={inventoryFormData.itemQuantity}
                                onChange={storeInput}
                                required
                            />
                            <br />
                            <label htmlFor="purchaseDate">Purchase Date</label>
                            <br />
                            <input
                                type="date"
                                id="purchaseDate"
                                value={inventoryFormData.purchaseDate}
                                onChange={storeInput}
                                required
                            />
                            <br />
                            <label htmlFor="stored">Where will this be Stored?</label>
                            <input
                                type="text"
                                id="stored"
                                value={inventoryFormData.stored}
                                onChange={storeInput}
                                required
                            />
                            <br />
                            
                            <br />
                            <button type="submit" className="invbutton submit-spacing">
                                Submit
                            </button>
                            <br />
                            <button
                                type="button"
                                onClick={() => setActive(false)}
                                className="invbutton"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
            </div>
            <div className="button-container remove-container">
                <button
                    className="invbutton"
                    onClick={() => setActiveRemove(true)}
                >
                    Remove from Inventory
                </button>
                {activeRemove && (
                    <div className="open remove-form">
                        <form id="removeFromInventory" onSubmit={submitRemoveForm}>
                            <label htmlFor="foodName">Food Name</label>
                            <input
                                type="text"
                                id="foodName"
                                value={removeFormData.foodName}
                                onChange={handleRemoveInput}
                                required
                            />
                            <br />
                            
                            <label htmlFor="itemQuantity">Quantity</label>
                            <input
                                type="number"
                                id="itemQuantity"
                                value={removeFormData.itemQuantity}
                                onChange={handleRemoveInput}
                                required
                            />
                            <br />
                            <br />
                            <label htmlFor="expirationDate">Expiration Date</label>
                            <input
                                type="date"
                                id="expirationDate"
                                value={removeFormData.expirationDate}
                                onChange={handleRemoveInput}
                                required
                            />
                            <br />
                            <br />
                            <button type="submit" className="invbutton submit-spacing">
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveRemove(false)}
                                className="invbutton"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
