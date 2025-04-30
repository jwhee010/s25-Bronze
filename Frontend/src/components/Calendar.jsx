import React from 'react';
import Navbar from "./Navbar"
import FullCalendar from './FullCalendar.jsx'
import InventoryForm from './InventoryForm.jsx';
import FoodCheckform from './FoodCheckform.jsx';
import './Calendar.css';
import TemporaryDrawer from './NotificationPane.jsx';
import NotificationPane from './NotificationPane.jsx';
import Divider from '@mui/material/Divider';

const Calendar = ({addNotification}) => {
    return (
        <div>
            <Navbar />
            {/*<NotificationPane/>*/}
            
            <FullCalendar/>
            <InventoryForm addNotification={addNotification}/>
            <FoodCheckform/>

            
           

        </div>
    );
};

export default Calendar;