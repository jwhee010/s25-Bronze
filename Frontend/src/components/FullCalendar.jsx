import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import './FullCalendar.css'
import React, { useState } from 'react';



export default function Calendar() {

   const handleEventClick = (clickInfo) =>{
    alert(clickInfo.event.title);
   }


  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      
    
      events={[
        {title: 'event 3', date: '2025-02-28'},
        { title: 'event 1', date: '2025-02-27' },
        { title: 'event 2', date: '2025-02-28' }
      ]}

      eventClick={handleEventClick}



    />


  
  )
}