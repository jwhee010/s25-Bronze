import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import './NotificationPane.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import IncentiveNotifications from './IncentiveNotifications';


export default function NotificationPane({notifications}) {
  const [open, setOpen] = React.useState(false);

  const [expiringItems, setExpiringItems] = React.useState([]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const getExpiringItems = async(token) => {
    try {
      const response = await axios.get('http://localhost:80/expiring', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(response.data);
      setExpiringItems(response.data.expiringItems);
    } catch (error) {
      console.error('Error retriving expiring food items: ', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    try {
      getExpiringItems(token);
    } catch (error) {
      console.error('Token decoding error: ', error);
    }
  }, []);

  
  const DrawerList = (
    <Box sx={{ width: 450, height:10000 }}  role="presentation"  onClick={toggleDrawer(false)} bgcolor={'#2e2d2c'}>

        <h1 className='notifHeader'> Notifications</h1>
        <h2 className='sectionHeader'>Inventory</h2>
        {/* populate this div with the text elements */}
        <div className='notifBox'>
          {expiringItems.map((item, index) => (
            <div key={ index } >
              <p>
                <span>{item.Expiration}:</span>
                <br />
                <span>Your {item.FoodName} is expriring soon on {item.Expiration}</span>
              </p>
              <Divider />
            </div>
          ))}
        </div>

        <div className='notifBox'>
          {notifications.map((notification, index) => (
            <div key={index}>
              <p>{notification.message}</p>
              <Divider />
            </div>
          ))}
        </div>

        <h2 className='sectionHeader'>ShelfFriends</h2>
         {/* populate this div with the text elements */}
        <div className='notifBox'>

          <p>Test 1 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATest</p>
            <Divider/>

            <p>Test 2</p>
            <Divider/>
            <p>Test 3</p>
            <Divider/>
            <p>Test 4</p>
            <Divider/>
            <p>Test 5</p>
            <Divider/>
            <p>Test 6</p>
            <Divider/>
            <p>Test 7</p>
            <Divider/>
            <p>Test 8</p>
        </div>

        <h2 className='sectionHeader'>Other</h2>
         {/* populate this div with the text elements */}
        <div className='notifBox'>
          <IncentiveNotifications />
            <Divider/>

            <p>Test 2</p>
            <Divider/>
            <p>Test 3</p>
            <Divider/>
            <p>Test 4</p>
            <Divider/>
            <p>Test 5</p>
            <Divider/>
            <p>Test 6</p>
            <Divider/>
            <p>Test 7</p>
            <Divider/>
            <p>Test 8</p>
        </div>
      
    </Box>
  );

  return (
    <div>
      <button className='drawerButton' onClick={toggleDrawer(true)}> ← Notifications </button>

      {/* drawer the opens from right */}
      {/* Referenced: https://mui.com/material-ui/react-drawer/ , referenced TemporaryDrawer */}

      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        {DrawerList}
      </Drawer>
    </div>
  );
}

