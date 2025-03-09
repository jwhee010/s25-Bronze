import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list'
import './FullCalendar.css'
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import EventDialog from './EventDialog.jsx';






export default function Calendar() {
 
  const [foodItems, setFoodItems] = useState([]);

  const getFoodItems = async(token) => {
    try {
      const response = await axios.get('http://localhost:80/calendar', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Food items retrived:', response.data.foodItems);

      setFoodItems(response.data.foodItems);
    } catch(error) {
        console.error('Error retriving food items:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    try {
      const decodedToken = jwtDecode(token);
    
      getFoodItems(token);

    } catch(error) {
        console.error('Token decoding error:', error);

    }
  }, []);


   // Event Interaction, to mark items as used or spoiled
  const handleEventClick = (clickInfo) =>{
          alert(clickInfo.event.title);
        <EventDialog/>
  } 

  const displayFoodItems = () => {
    if(foodItems.length == 0) {
      return <p>No food items found</p>;
    }
    return foodItems.map((item, index) => (
      <div key={index}>
        <p>Food Name: {item.FoodName}</p>
        <p>Expiration Date: {item.Expiration}</p>
      </div>
    ));
  };

  return (
    <>
      <FullCalendar
        plugins={[ dayGridPlugin, listPlugin]}

        initialView="dayGridMonth" 

        headerToolbar={{
          left: 'prev,next,today',
          center:'title',
          right:'dayGridMonth, listMonth'


        }}
     
        events={[
          {title: 'event 3', date: '2025-03-10'},
          { title: 'event 1', date: '2025-03-27' },
          { title: 'event 2', date: '2025-03-28' }
        ]}

        eventClick={handleEventClick}



      />
      <div style={{color: 'black'}}>
        <h2>Food Items</h2>
        {displayFoodItems()}
      </div>
    </>


  
  );
}