import React from 'react';
import Navbar from "./Navbar"
import FullCalendar from './FullCalendar.jsx'

const Calendar = () => {
    return (
        <div>
            <Navbar />
            <h1>Calendar</h1>
            <FullCalendar/>
        </div>
    );
};

export default Calendar;