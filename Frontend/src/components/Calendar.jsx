import React from 'react';
import Navbar from "./Navbar"
import FullCalendar from './FullCalendar.jsx'
import InventoryForm from './InventoryForm.jsx';
import FoodCheckform from './FoodCheckform.jsx'

const Calendar = () => {
    return (
        <div>
            <Navbar />
            <h1>Calendar</h1>
        
            <FullCalendar/>
            <InventoryForm/>
            <FoodCheckform/>

            
           

        </div>
    );
};

export default Calendar;