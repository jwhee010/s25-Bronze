import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import './NotificationPane.css'


export default function NotificationPane() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  
  const DrawerList = (
    <Box sx={{ width: 450, height:10000 }}  role="presentation"  onClick={toggleDrawer(false)} bgcolor={'#2e2d2c'}>

        <h1 className='notifHeader'> Notifications</h1>
        <h2 className='sectionHeader'>Inventory</h2>
        {/* populate this div with the text elements */}
        <div className='notifBox'>
            <p>
                <p2>3/21/2025:</p2>
                <br/>
                 Your apples are expiring soon on 'insert date'
            </p>
            <Divider/>

            <p> 3/21/2025: Your pears are expiring soon on 'insert date'</p>
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

