import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list'
import './FullCalendar.css'
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import EventDialog from './EventDialog.jsx';
import FoodCheckform from './FoodCheckform.jsx';





export default function Calendar() {
  const [foodItems, setFoodItems] = useState([]);
  const [foodQuantities, setFoodQuantities] = useState([]); // New state for food quantities

  const [events, setFoodAsEvents] = useState([]); // for converting food items from database into events on the calendar

  const getFoodItems = async (token) => {
    try {
      const response = await axios.get('http://localhost:80/calendar', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //console.log('Food items retrieved:', response.data.foodItems);
      setFoodItems(response.data.foodItems);

      const events = response.data.foodItems.map(item => ({
        title: item.FoodName,
        date: item.Expiration
      }));

      setFoodAsEvents(events);

    } catch (error) {
      console.error('Error retrieving food items:', error);
    }
  };

  // ✅ New function to fetch food quantities
  const getFoodQuantities = async (token) => {
    try {
      const response = await axios.get('http://localhost:80/food-quantity', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //console.log('Food quantities retrieved:', response.data.foodQuantities);
      setFoodQuantities(response.data.foodQuantities);
    } catch (error) {
      console.error('Error retrieving food quantities:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    try {
      getFoodItems(token);
      getFoodQuantities(token); // ✅ Fetch food quantities on load
    } catch (error) {
      console.error('Token decoding error:', error);
    }
  }, []);


   //Event Interaction, to mark items as used or spoiled

   //(Currently) Copies the event title to clipboard
   //Paste the event title to the consumed/spoiled form
  const handleEventClick = (clickInfo) =>{
           alert(clickInfo.event.title + ' Copied to Clipboard');
        navigator.clipboard.writeText(clickInfo.event.title);
  } 



  const displayFoodItems = () => {
    if (foodItems.length === 0 && foodQuantities.length === 0) {
      return <p>No food items found</p>;
    }
    return foodItems.map((item, index) => (
      <div key={index}>
        <p>Food Name: {item.FoodName}</p>
        <p>Expiration Date: {item.Expiration}</p>
        <p>
  Quantity: {foodQuantities.length > 0 
    ? foodQuantities.find(q => q.FoodName.trim().toLowerCase() === item.FoodName.trim().toLowerCase())?.Quantity || 'N/A' 
    : 'Loading...'}
</p>

      </div>
    ));
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,listMonth'
        }}
        events={events}
        // event styling:
        eventBackgroundColor='#629c59'
        eventColor='#629c59'

        editable={true}

        eventClick={handleEventClick}
      />
      <div style={{ color: 'black' }}>
        <h2>Food Items</h2>
        {displayFoodItems()}
      </div>
    </>
  );
}
