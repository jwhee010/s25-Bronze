import React, { useEffect, useState } from "react";
import axios from "axios";

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
    setFoodItems(response.data.foodItems);
    
    } catch (error) {
        console.error('Error retrieving food items:', error);
    };

};

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
            <button type="button" onClick={showFoodItems}> share food</button>
            <button type = "button" onClick={sharedFoods}> food friends are sharing</button>
        </div>
    )
}