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
            <h1 className = "calKey">Legend
                <p className='keyStatement'>Days till
                    <br/>
                    Expiration
                </p>
                <Divider sx={{ borderBottomWidth: 2}} />

                <p className="greybox">expired</p>
            
                <p className='redbox'>1-3</p>
                
                <p className='yellowbox'>4-7</p>
                
                <p className ='greenbox'>8+</p>
                
            </h1>
            <h1 className='calendarHeader'>Calendar</h1>
            
            <FullCalendar/>
            <InventoryForm addNotification={addNotification}/>
            <FoodCheckform/>

            
           

        </div>
    );
};

export default Calendar;