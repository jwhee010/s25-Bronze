import { useState, useEffect } from "react";
import "./InventoryForm.css";
import axios from 'axios';
import { common } from "@mui/material/colors";

export default function InventoryForm({addNotification}) {
    const [active, setActive] = useState(false);

    const [commonlyWasted, setWastedFood] = useState([]);

    // Retrive top 5 wasted food from the database, originally done by Jaylen
    const getWastedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/topWaste', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const wastedFood = response.data.foodItems.map((item, index) => ({
                id: index,
                value: item.Quantity,
                label: item.FoodName
            }));

            setWastedFood(wastedFood);
        }
        catch(error) {
            console.error('Error retrieving food items:', error)
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        try {
            getWastedFood(token);
        } catch (error) {
            console.error('Token decoding error:', error);
        }
    }, []);

    // Compare foodName from the input form to commonly wasted food items
    function checkIfWasted(commonlyWasted, foodName) {
        for(let i = 0; i < commonlyWasted.length; i++) {
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
        shareBool: false,
    });

    // reference used for popup button https://codesandbox.io/p/sandbox/react-usestate-open-and-close-buttons-ryl84?file=%2Fsrc%2FApp.js
    function closeItem() {
        setActive(false);
    }
    function openItem() {
        setActive(true);
    }

    // stores the user's inputted values
    const storeInput = (e) => {
        const { id, value, type, checked } = e.target;
        // The ... copies all of the previous data into the new data
        setInventoryFormData((prevData) => ({
            ...prevData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    // Submits the data to the database
    const submitForm = async (e) => {
        e.preventDefault();

        try {

            const foodName = inventoryFormData.itemName;
            
            const isWasted = checkIfWasted(commonlyWasted, foodName); 

            // Alerts user if a food item is commonly wasted on form submission
            if(isWasted) {
                addNotification(`"${foodName}" is a commonly wasted food item, be mindful of your waste!`);
            }

            const token = localStorage.getItem("authToken");

            const ownedItemsRes = await axios.get('http://localhost:80/itemName', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            const ownedItems = ownedItemsRes.data.itemNames.map(name => name.toLowerCase());
    
            if (ownedItems.includes(foodName.toLowerCase())) {
                addNotification(`You already have "${foodName}" in your inventory.`);
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

            // this console log is just so eslint doesn't yell about an unused variable
            console.log(response.data);

            alert("Food item added or updated successfully!");
            closeItem();

        } catch (error) {
            console.error("Error adding food item:", error);
            alert("Failed to add or update food item.");
        }
    };

    return (

        <div className='formbutton'>
            <button className="invbutton" onClick={openItem}>Add to Inventory</button>

            {active && (
                <div className={active ? "open" : "close"}>

                    <form id="inputToInventory" onSubmit={submitForm}>
                        <label htmlFor="itemName" className="labelText">Item Name</label>
                        <input type="text" id="itemName" value={inventoryFormData.itemName}
                            onChange={storeInput} required></input>
                        <br></br>

                        <label htmlFor="itemQuantity" className="labelText">Item Quantity</label>
                        <input type="number" id="itemQuantity" value={inventoryFormData.itemQuantity}
                            onChange={storeInput} required></input>
                        <br></br>

                        <label htmlFor="purchaseDate" className="labelText">Purchase Date</label>
                        <input type="text" id="purchaseDate" value={inventoryFormData.purchaseDate}
                            onChange={storeInput} required></input>
                        <br></br>

                        <label htmlFor="stored" className="labelText">Where will this be Stored?</label>
                        <input type="text" id="stored" value={inventoryFormData.stored}
                            onChange={storeInput} required></input>
                        <br></br>

                        {/** has to be implemented */}
                        <label htmlFor="shareBool" className="labelText">Sharable?</label>
                        <input type="checkbox"></input>
                        <br></br>

                        <button type="submit" className="submitB">Submit</button>
                        <button type="button" onClick={closeItem} className="cancelB">Cancel</button>
                    </form>
                </div>
            )}

        </div>
    )
}