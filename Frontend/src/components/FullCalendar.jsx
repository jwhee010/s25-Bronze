import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import './FullCalendar.css'

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      height = {500}

     
      
    />
  )
}