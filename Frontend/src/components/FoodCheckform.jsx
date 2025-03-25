import React, { useState } from "react";
import "./FoodCheckform.css"

export default function InventoryForm(props){
    const [active, setAct] = useState(true);

    // reference used for popup button https://codesandbox.io/p/sandbox/react-usestate-open-and-close-buttons-ryl84?file=%2Fsrc%2FApp.js
    function closeItem() {
        setAct(true);
        //enables foodCheckform button
        formButton.disabled = false;
      }

    function openItem()  {
        setAct(false);
      }

   
     var formButton = document.getElementById("formButton");
    //-------For DropDown Menu-------
    //Referenced: https://stackoverflow.com/questions/67895964/how-to-dynamically-add-more-elements-to-a-dropdown-list-with-vanilla-js 

    // Fill this array with food Items for the Drop Down
    let foodItemArr = ["Shrimp", "Fish", "Crab", "Crayfish", "Fish Sticks", "Cabbage"];
       
     //Listen for dropdown click
    let dropDown = document.getElementById("foodItem");
    dropDown?.addEventListener('click', addItemsDropDown, {once:true});
      
    //Refreshs dropDown children, Puts values from foodItemArr[] to options in dropdown list
     function addItemsDropDown(event){
        //Prevents foodCheckform button from being clickable
           formButton.disabled = true;

           //Refreshs dropDown's children, removes all options
           dropDown.replaceChildren();

             event.stopPropagation();
             event.preventDefault();
         
        //Takes values from foodItemArr, turn into dropDown options
        foodItemArr.forEach(item =>{
            var option = document.createElement("option");
            option.text = item;
            dropDown.appendChild(option);
        });

      }
      //-------------

      

      
    

        
      

return( 
    
    <div className='checkbutton'>
         <button className = "invCheck" id="formButton" type="button" onClick={openItem}>Consumed/Spoiled Form</button> 
        
        <h1 className={active ? "cclose" : "copen"}>

            <form id = "SetInventoryCheck">

              {/*   <label htmlFor="foodItemName">Item Name</label>
                <input type="text" id="foodItemName"></input> */}

                <label htmlFor="foodItem" className="labelText">Food Item</label>
                <br/>
                <select name="foodItem" id="foodItem">
                </select>
                <br/>
                
                <label htmlFor="foodItemQuant" className="labelText">Quantity</label>
                <br/>
                <input type="number" id="foodItemQuant"></input>

            </form>
            <br/>

            <button onClick={closeItem} className="consumeB">Consumed</button>
            <button onClick={closeItem} className="spoilB">Spoiled</button>
            <button onClick={closeItem} className="cancelB">Cancel</button>
        </h1>

    </div>
)
}