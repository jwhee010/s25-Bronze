import React, { useState, useEffect } from "react";
import "./FoodCheckform.css";
import axios from "axios";

export default function InventoryForm(props) {
  const [active, setAct] = useState(true);

  const [foodItems, setFoodItems] = useState([]);

  const [selectedFoodItem, setSelectedFoodItem] = useState("");

  const [quantity, setQuantity] = useState("");

  const [selectedExpiration, setSelectedExpiration] = useState("");
  
  const [selectedOption, setSelectedOption] = useState("");

  const getFoodItems = async (token) => {
    try{
      const response = await axios.get('http://localhost:80/calendar', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFoodItems(response.data.foodItems);

    } catch (error) {
      console.error('Error retrieving food items: ', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    try {
      getFoodItems(token);
    } catch(error) {
      console.error('Token decoding error');
    }

  }, []);

  const handleFoodSelection = (e) => {
    const value = e.target.value;
    setSelectedOption(value);

    const [name, expiration] = value.split("||");
    setSelectedFoodItem(name);
    setSelectedExpiration(expiration);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const getAvailableQuantity = () => {
    const selectedItem = foodItems.find((item) => item.FoodName === selectedFoodItem);
    return selectedItem ? selectedItem.Quantity : 0;
  };

  const handleConsume = async () => {
    try {
      const token = localStorage.getItem("authToken");

      console.log("Sending data for consumption:");
      console.log("FoodName:", selectedFoodItem);
      console.log("Quantity:", quantity);

      if (!selectedFoodItem || !quantity) {
        throw new Error("Food Name or Quantity is missing");
      }

      const availableQuantity = getAvailableQuantity();

      if (parseInt(quantity) > availableQuantity) {
        throw new Error("Cannot consume more than available quantity");
      }

      const response = await axios.post(
        "http://localhost:80/consumeFood",
        {
          FoodName: selectedFoodItem,
          Quantity: parseInt(quantity),
          Action: "consume",
          Expiration: selectedExpiration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      alert(`${quantity} of ${selectedFoodItem} consumed!`);
      closeItem();
      window.location.reload();
    } catch (error) {
      console.error("Error consuming food item:", error);
      alert(`Failed to consume food item: ${error.message}`);
    }
  };

  const handleSpoil = async () => {
    try {
      const token = localStorage.getItem("authToken");

      console.log("Sending data for spoilage:");
      console.log("FoodName:", selectedFoodItem);
      console.log("Quantity:", quantity);

      if (!selectedFoodItem || !quantity) {
        throw new Error("Food Name or Quantity is missing");
      }

      const availableQuantity = getAvailableQuantity();

      if (parseInt(quantity) > availableQuantity) {
        throw new Error("Cannot spoil more than available quantity");
      }

      const response = await axios.post(
        "http://localhost:80/expireFood",
        {
          FoodName: selectedFoodItem,
          Quantity: parseInt(quantity),
          Action: "spoil",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);
      alert(`${quantity} of ${selectedFoodItem} spoiled!`);
      closeItem();
      window.location.reload();
    } catch (error) {
      console.error("Error spoiling food item:", error);
      alert(`Failed to spoil food item: ${error.message}`);
    }
  };

  // reference used for popup button https://codesandbox.io/p/sandbox/react-usestate-open-and-close-buttons-ryl84?file=%2Fsrc%2FApp.js
  function closeItem() {
    setAct(true);
    //enables foodCheckform button
    formButton.disabled = false;
  }

  function openItem() {
    setAct(false);
  }

 /* var formButton = document.getElementById("formButton");
  //-------For DropDown Menu-------
  //Referenced: https://stackoverflow.com/questions/67895964/how-to-dynamically-add-more-elements-to-a-dropdown-list-with-vanilla-js

  // Fill this array with food Items for the Drop Down
  // let foodItemArr = [
  //   "Shrimp",
  //   "Fish",
  //   "Crab",
  //   "Crayfish",
  //   "Fish Sticks",
  //   "Cabbage",
  // ];

  //Listen for dropdown click
  let dropDown = document.getElementById("foodItem");
  dropDown?.addEventListener("click", addItemsDropDown, { once: true });

  //Refreshs dropDown children, Puts values from foodItemArr[] to options in dropdown list
  function addItemsDropDown(event) {
    //Prevents foodCheckform button from being clickable
    formButton.disabled = true;

    //Refreshs dropDown's children, removes all options
    dropDown.replaceChildren();

    event.stopPropagation();
    event.preventDefault();

    //Takes values from foodItemArr, turn into dropDown options
    foodItems.forEach((item) => {
      var option = document.createElement("option");
      option.text = item.FoodName;
      dropDown.appendChild(option);
    });
  } */
  //-------------

  return (
    <div className="checkbutton">
      <button
        className="invCheck"
        id="formButton"
        type="button"
        onClick={openItem}
      >
        Consumed/Spoiled Form
      </button>

      <h1 className={active ? "cclose" : "copen"}>
        <form id="SetInventoryCheck">
          {/*   <label htmlFor="foodItemName">Item Name</label>
                <input type="text" id="foodItemName"></input> */}

          <label htmlFor="foodItem"className="labelText">Food Item</label>
          <br />
          
          <select
            name="foodItem"
            id="foodItem"
            value={selectedOption}
            onChange={handleFoodSelection}
          >
            <option value="" disabled hidden>-- Select Food --</option>
            {foodItems.map((item, index) => (
              <option key={index} value={`${item.FoodName}||${item.Expiration}`}>
                {item.FoodName} {item.Expiration.split("-").slice(1).join("-")}
              </option>
            ))}
          </select>
          {/*<select name="foodItem" id="foodItem"></select>*/}
          <br />

          <label htmlFor="foodItemQuant" className="labelText">Quantity</label>
          <br />
          <input
            type="number"
            id="foodItemQuant"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </form>
        <br />

        <button onClick={handleConsume} className="consumeB">
          Consumed
        </button>
        <button onClick={handleSpoil} className="spoilB">
          Spoiled
        </button>
        <button onClick={closeItem} className="cancelB">
          Cancel
        </button>
        </h1>

    </div>
  );
}
