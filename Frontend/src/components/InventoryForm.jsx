import React, { useState } from "react";
import "./InventoryForm.css"

export default function InventoryForm(){
    const [active, setActive] = useState(true);

    // reference used for popup button https://codesandbox.io/p/sandbox/react-usestate-open-and-close-buttons-ryl84?file=%2Fsrc%2FApp.js
    function closeItem() {
        setActive(true);
      }
      function openItem() {
        setActive(false);
      }

return(
    

    <div className='formbutton'>
        <button className="invbutton" onClick={openItem}>Add to Inventory</button>
        
        <h1 className={active ? "close" : "open"}>

            <form id="inputToInventory">
                <label for="itemName">Item Name</label>
                <input type="text" id="itemName"></input>
                <br></br>

                <lable for="itemQuantity">Item Quantity</lable>
                <input type="number" id="itemQuantity"></input>
                <br></br>

                <label for="purchaseDate">Purchase Date</label>
                <input type="text" id="purchaseDate"></input>
                <br></br>

                <label for="stored">Where will this be Stored?</label>
                <input type="text" id="stored"></input>
                <br></br>

                <lable for="shareBool">Sharable?</lable>
                <input type="checkbox"></input>
                <br></br>
                

            </form>
    
            <button type="submit" form="inputToInventory" value="Submit">Submit</button>
            <button onClick={closeItem}>Cancel</button>
        </h1>

    </div>




)


}