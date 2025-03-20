import React from 'react';
import FullCalendar from '@fullcalendar/react';
import { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
  } from "@mui/material";

// reference for Dialog https://www.scaler.com/topics/mui-dialog/
 function EventDialog(){
    const[open, setOpen] = useState(true);
    // const[eventName] = props;

    const handleClickOpen = () =>{
        setOpen(true);
    };

    const handleClose = () =>{
        setOpen(false);
    };


    return(
     
        <div>
        <Dialog open={open} onClose={handleClose} onLoad={handleClickOpen}>
            <DialogTitle>
                <Typography>
                    {/* {props.name}
                    {eventName} */}
                    Dialog Test Dialog Test
                </Typography>
            </DialogTitle>

            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Consumed
                </Button>
                <Button variant="contained" onClick={handleClose}>
                    Spoiled
                </Button>




            </DialogActions>





        </Dialog>

        </div>
    );
    
}

export default EventDialog;

