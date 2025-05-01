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
  const [usePredictiveItems, setUsePredictiveItems] = useState(false) // for filtering the calendar by predictive waste items

  const [events, setFoodAsEvents] = useState([]); // for converting food items from database into events on the calendar

  const getFoodItems = async (token, usePredictiveItems = false) => {
    try {
      const chosenMethod = usePredictiveItems ? 'http://localhost:80/predictiveCalendar' : 'http://localhost:80/calendar';

      const response = await axios.get(chosenMethod, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      //console.log('Food items retrieved:', response.data.foodItems);
      setFoodItems(response.data.foodItems);
      
      // all of the extra `\xa0` were so I could get the purchase date to show up on a new line in the list view :)
      const events = response.data.foodItems.map(item => ({
        title: `${item.FoodName}` +'\xa0\xa0\xa0\xa0'+`Quantity: ${item.Quantity}` 
        +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + `\nPurchase Date: ${item.PurchaseDate.slice(0, 10)}`,
        date: item.Expiration.slice(0,10),
        id: `${item.distance}_${item.FoodName}_${item.Expiration}`
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
      getFoodItems(token, usePredictiveItems);
      getFoodQuantities(token); // ✅ Fetch food quantities on load
    } catch (error) {
      console.error('Token decoding error:', error);
    }
  }, [usePredictiveItems]);


   //Event Interaction, to mark items as used or spoiled

   //(Currently) Copies the event title to clipboard
   //Paste the event title to the consumed/spoiled form
  const handleEventClick = (clickInfo) =>{
           alert(clickInfo.event.title + ' Copied to Clipboard');
        navigator.clipboard.writeText(clickInfo.event.title);
  } 


// This function that is currently commented out displays the food items in the
// current user's inventory, along with their quantity values and their day of expiration.

//   const displayFoodItems = () => {
//     if (foodItems.length === 0 && foodQuantities.length === 0) {
//       return <p>No food items found</p>;
//     }
//     return foodItems.map((item, index) => (
//       <div key={index}>
//         <p>Food Name: {item.FoodName}</p>
//         <p>Expiration Date: {item.Expiration}</p>
//         <p>
//   Quantity: {foodQuantities.length > 0 
//     ? foodQuantities.find(q => q.FoodName.trim().toLowerCase() === item.FoodName.trim().toLowerCase())?.Quantity || 'N/A' 
//     : 'Loading...'}
// </p>

//       </div>
//     ));
//   };

  return (
    <>

               <div className='divMarg'>
                       {/* Calendar Key */}
                    <h1 className='calendarHeader'>Calendar</h1>
                      <div className = "calKey">
                               <div className='keyHeader'>Days Until Expiration Legend</div> 
                        <div className='keyStatement'>
                           
                        <p className="greybox">expired</p>

                        <p className='redbox'>0-3</p>
                        
                        <p className='yellowbox'>4-7</p>
                        
                        <p className ='greenbox'>8+</p>
                        </div>
        
                    </div>

                    <button  className = "predictiveButton" onClick={() => setUsePredictiveItems(prev => !prev)}>
                      {usePredictiveItems ? 'Show Full Calendar' : 'Filter by Predictive Waste'}
                    </button>
      </div>
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
        // eventBackgroundColor='#629c59'
        // eventColor='#629c59'

        editable={true}

        eventMouseEnter= {function(info) {info.el.title = info.event.title + " "}}

        eventClick={handleEventClick}
 
        eventDidMount={function(info)
          {
            const idParts = info.event.id.split('_');
            const distance = parseInt(idParts[0]);

            if(distance < 0)
            {
              //Grey Past Days
              info.el.style.backgroundColor = '#848484';
              info.el.style.borderColor = '#848484';

            }
            else if(distance >= 0 && distance<= 3)
            {
              //Red 1-3 days
              info.el.style.backgroundColor = '#ee6461';
              info.el.style.borderColor = '#ee6461';
            }
            else if(distance >= 4 && distance <= 7)
            {
            //Yellow 4-7 days
              info.el.style.backgroundColor = '#eed661';
              info.el.style.borderColor = '#eed661';

            }
            else
            {
              //Green 8+ days
              info.el.style.backgroundColor = '#629c59';
              info.el.style.borderColor = '#629c59';
            }

          }
        } 

       
      />
      {/* <div style={{ color: 'black' }}>
        <h2>Food Items</h2>
        {displayFoodItems()}
      </div> */}
    </>
  );
}
