import React from 'react';
import FullCalendar from '@fullcalendar/react';
import './EventDialog.css';
import Divider from '@mui/material/Divider';
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

            {/* --Dashboard button-- */}

          
            <Button onClick ={handleClickOpen} sx={{m:'auto', background:"#c94908", color:"white", width:200, height: 50, 
                fontFamily:"monospace", fontSize:15, fontWeight:'bold',
                ':hover':{background:"white", color:"#eb5234"}, borderRadius:10}}>
                -Open Your Report-
            </Button>
        
        <Dialog open={open} onClose={handleClose} onLoad={handleClickOpen}>
        
           {/* --Title-- */}

            <DialogTitle sx={{ color:"white",
                background: "#2c2e2c",
                '& .MuiPaper-root': {
                  background: "#2c2e2c"
                },
                '& .MuiBackdrop-root': {
                  backgroundColor: 'transparent'
            }
            }}>
                <Typography>
                    <span className='dialogHeadr'>-Your Report-</span>
                </Typography>

            </DialogTitle>

            <Divider sx={{background:"#636664"}}/>

            {/* --Dialog Text box, report here--*/}
            <DialogContent sx={{width:500, height:600, color:"white",
                background: "#2c2e2c",
                '& .MuiPaper-root': {
                  background: "#2c2e2c"
                },
                '& .MuiBackdrop-root': {
                  backgroundColor: 'transparent'
            }
            }}>

             <div>
                <h1 className='diaContHeadr'>Shopping?</h1>

                <p>Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                </p>

                <h1 className="diaContHeadr">You Have Items Expiring Soon</h1>

                <p>!Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                </p>

                <h1 className="diaContHeadr">Your Waste Habits</h1>
                <p>!Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                </p>
           </div>
            </DialogContent>

            <Divider sx={{background:"#636664"}}/>
 
            {/* --Close button-- */}

            <DialogActions sx={{ color:"white",
                background: "#2c2e2c",
                '& .MuiPaper-root': {
                  background: "#2c2e2c"
                },
                '& .MuiBackdrop-root': {
                  backgroundColor: 'transparent'
            }
            }}>
                <Button variant="contained" onClick={handleClose} sx={{m:'auto', background:"#5fba76"}}>
                    Close
                </Button>

            </DialogActions>

        </Dialog>

        </div>
    );
    
}

export default EventDialog;

