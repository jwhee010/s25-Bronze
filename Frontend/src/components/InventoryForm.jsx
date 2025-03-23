import { useState } from "react";
import "./InventoryForm.css";
import axios from 'axios';

export default function InventoryForm() {
    const [active, setActive] = useState(false);
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
            const token = localStorage.getItem("authToken");

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
                        <label htmlFor="itemName">Item Name</label>
                        <input type="text" id="itemName" value={inventoryFormData.itemName}
                            onChange={storeInput} required></input>
                        <br></br>

                        <label htmlFor="itemQuantity">Item Quantity</label>
                        <input type="number" id="itemQuantity" value={inventoryFormData.itemQuantity}
                            onChange={storeInput} required></input>
                        <br></br>

                        <label htmlFor="purchaseDate">Purchase Date</label>
                        <input type="text" id="purchaseDate" value={inventoryFormData.purchaseDate}
                            onChange={storeInput} required></input>
                        <br></br>

                        <label htmlFor="stored">Where will this be Stored?</label>
                        <input type="text" id="stored" value={inventoryFormData.stored}
                            onChange={storeInput} required></input>
                        <br></br>

                        {/** has to be implemented */}
                        <label htmlFor="shareBool">Sharable?</label>
                        <input type="checkbox"></input>
                        <br></br>

                        <button type="submit">Submit</button>
                        <button type="button" onClick={closeItem}>Cancel</button>
                    </form>
                </div>
            )}

        </div>
    )
}