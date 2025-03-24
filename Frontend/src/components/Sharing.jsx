import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Sharing.css";

export default function Sharing(){
    const [foodItems, setFoodItems] = useState([]);


    //return the food items that the user has and take them to a newish page
    const showFoodItems = async (token) => {
        try{
            const response = await axios.get('http://localhost:80/sharing' ,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });

    console.log('Food items retrieved', response.data.foodItems);
    setFoodItems(response.data.foodItems || []);
    
    } catch (error) {
        console.error('Error retrieving food items:', error);
    };

    };

    const shareFood = async () => {

    }


    useEffect(() => {
    const token = localStorage.getItem('authToken');

    try {
      showFoodItems(token);
    } catch (error) {
      console.error('Token decoding error:', error);
    }
    }, []);
    
    const sharedFoods = () =>{
        console.log("friends food");
    };

    return(
        <div>
           <h3>Share your food</h3>
            {foodItems.length > 0 ? (
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>Expiration Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.FoodName}</td>
                                <td>{item.Quantity}</td>
                                <td>{item.ExpirationStatus}</td>
                                <td>
                                    {/*Makes the the food item sharable or cancels the sharablity*/}
                                    <button>Share</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No food items available</p>
            )}
        </div>
    )
}