import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list'
import './FullCalendar.css'
import React, { useState } from 'react';



export default function Calendar() {

   const handleEventClick = (clickInfo) =>{
    alert(clickInfo.event.title);
   }

  return (
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


  
  )
}