import React from 'react';
import Navbar from "./Navbar"
import FullCalendar from './FullCalendar.jsx'
import InventoryForm from './InventoryForm.jsx';
import FoodCheckform from './FoodCheckform.jsx'
import './Calendar.css'

const Calendar = () => {
    return (
        <div>
            <Navbar />
            <h1 className='calendarHeader'>Calendar</h1>
        
            <FullCalendar/>
            <InventoryForm/>
            <FoodCheckform/>

            
           

        </div>
    );
};

export default Calendar;