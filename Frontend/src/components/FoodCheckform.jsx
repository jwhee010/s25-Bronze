import React, { useState } from "react";
import "./FoodCheckform.css"

export default function InventoryForm(props){
    const [active, setAct] = useState(true);

    // reference used for popup button https://codesandbox.io/p/sandbox/react-usestate-open-and-close-buttons-ryl84?file=%2Fsrc%2FApp.js
    function closeItem() {
        setAct(true);
      }
      function openItem() {
        setAct(false);
      }

return( 
    <div className='checkbutton'>
         <button className = "invCheck" onClick={openItem}>Consumed/Spoiled Form</button>
        
        <h1 className={active ? "cclose" : "copen"}>


            <form id = "SetInventoryCheck">
                <label htmlFor="foodItemName">Item Name</label>
                <input type="text" id="foodItemName"></input>
                <br/>
                <label htmlFor="foodItemQuant">Quantity</label>
                <br/>
                <input type="number" id="foodItemQuant"></input>

            </form>
            <br/>

            <button onClick={closeItem}>Consumed</button>
            <button onClick={closeItem}>Spoiled</button>
            <button onClick={closeItem}>Cancel</button>
        </h1>

    </div>
)
}