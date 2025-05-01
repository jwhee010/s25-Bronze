import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import './EventDialog.css';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import axios from "axios";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Button,
} from "@mui/material";

// reference for Dialog https://www.scaler.com/topics/mui-dialog/
function EventDialog() {
    const [open, setOpen] = useState(true);
    // const[eventName] = props;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [consumedItems, setConsumedItems] = useState([]);
    const [wastedItems, setWastedItems] = useState([]);

    const getConsumedItems = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/consumedData', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Your consumed data is", response.data)
            setConsumedItems(response.data.consumedItems);
        } catch (error) {
            console.error("Error retrieving consumed items", error)
        }
    };

    const getWastedItems = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/wastedData', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Your wasted data is", response.data)
            setWastedItems(response.data.wastedItems);
        } catch (error) {
            console.error("Error retrieving wasted items", error)
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        try {
            getConsumedItems(token);
            getWastedItems(token);
        } catch (error) {
            console.error('An error occured while retrieving report data.', error);
        }
    }, []);


    return (

        <div>

            {/* --Dashboard button-- */}


            <Button onClick={handleClickOpen} sx={{
                m: 'auto', background: "#c94908", color: "white", width: 200, height: 50,
                fontFamily: "monospace", fontSize: 15, fontWeight: 'bold',
                ':hover': { background: "white", color: "#eb5234" }, borderRadius: 10
            }}>
                -Open Your Report-
            </Button>

            <Dialog open={open} onClose={handleClose} onLoad={handleClickOpen}>

                {/* --Title-- */}

                <DialogTitle sx={{
                    color: "white",
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

                <Divider sx={{ background: "#636664" }} />

                {/* --Dialog Text box, report here--*/}
                <DialogContent sx={{
                    width: 500, height: 600, color: "white",
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

                        {(() => {

                            // This map is for both the consumed and wasted items
                            // so that we can do stuff that needs both of them at
                            // the same time
                            const itemMap = {};

                            // This maps the consumed items into the itemMap
                            consumedItems.forEach(item => {
                                if (!itemMap[item.FoodItemID]) {
                                    itemMap[item.FoodItemID] = { FoodName: item.FoodName, consumed: 0, wasted: 0 };
                                }
                                itemMap[item.FoodItemID].consumed += item.Quantity;
                            });

                            // This maps the wasted items into the itemMap
                            wastedItems.forEach(item => {
                                if (!itemMap[item.FoodItemID]) {
                                    itemMap[item.FoodItemID] = { FoodName: item.FoodName, consumed: 0, wasted: 0 };
                                }
                                itemMap[item.FoodItemID].wasted += item.Quantity;
                            });

                            const good = [];
                            const okay = [];
                            const bad = [];

                            Object.entries(itemMap).forEach(([id, { FoodName, consumed, wasted }]) => {
                                const total = Number(consumed) + Number(wasted);
                                console.log(`The total for "${FoodName}"  is: ` + total);

                                // This part accounts for no data to report
                                if (total === 0) return (
                                    <h2>Insufficient data to report on. Start eating!</h2>
                                );

                                const percentage = consumed / total;
                                const percentStr = Math.round(percentage * 100);

                                if (consumed === 0) {
                                    bad.push(<span className='basicReportText'>
                                        <span className='badItem'>{FoodName}</span> – your wastage rate is <span className='badItem'>100%</span>.
                                    </span>)
                                } else if (wasted === 0) {
                                    good.push(<span className='basicReportText'>
                                        <span className='goodItem'>{FoodName}</span> – your consumption rate is <span className='goodItem'>100%</span>!
                                    </span>)
                                } else if (percentage >= 0.7) {
                                    good.push(<span className='basicReportText'>
                                        <span className='goodItem'>{FoodName}</span> – your consumption rate is <span className='goodItem'>{percentStr}%</span>.
                                    </span>);
                                } else if (percentage >= 0.5) {
                                    okay.push(<span className='basicReportText'>
                                        <span className='okayItem'>{FoodName}</span> – your consumption rate is <span className='okayItem'>{percentStr}%</span>.
                                    </span>);
                                } else {
                                    const wastePercent = Math.round((wasted / total) * 100);
                                    bad.push(<span className='basicReportText'>
                                        <span className='badItem'>{FoodName}</span> – your wastage rate is <span className='badItem'>{wastePercent}%</span>.
                                    </span>);
                                }
                            });

                            return (
                                <div>
                                    {good.length > 0 && (
                                        <>
                                            <h2 className='diaContSubHeader'>You&apos;re doing <b style={{ color: 'rgb(41, 164, 41)' }}>good</b> with:</h2>
                                            <h3 className='diaContSubHeader2'>
                                                (It&apos;s okay to buy more of these)
                                            </h3>
                                            <ul>{good.map((message, i) => <li key={`good-${i}`}>{message}</li>)}</ul>
                                        </>
                                    )}

                                    {okay.length > 0 && (
                                        <>
                                            <h2 className='diaContSubHeader'>You&apos;re doing <b style={{ color: 'yellow' }}>okay</b> with:</h2>
                                            <h3 className='diaContSubHeader2'>
                                                (It&apos;s okay to buy these, but try not to buy as much)
                                            </h3>
                                            <ul>{okay.map((message, i) => <li key={`okay-${i}`}>{message}</li>)}</ul>
                                        </>
                                    )}

                                    {bad.length > 0 && (
                                        <>
                                            <h2 className='diaContSubHeader'>You&apos;re doing  <b style={{ color: 'red' }}>bad</b> with:</h2>
                                            <h3 className='diaContSubHeader2'>
                                                (Maybe reconsider buying these)
                                            </h3>
                                            <ul>{bad.map((message, i) => <li key={`bad-${i}`}>{message}</li>)}</ul>
                                        </>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </DialogContent>

                <Divider sx={{ background: "#636664" }} />

                {/* --Close button-- */}

                <DialogActions sx={{
                    color: "white",
                    background: "#2c2e2c",
                    '& .MuiPaper-root': {
                        background: "#2c2e2c"
                    },
                    '& .MuiBackdrop-root': {
                        backgroundColor: 'transparent'
                    }
                }}>
                    <Button variant="contained" onClick={handleClose} sx={{ m: 'auto', background: "#5fba76" }}>
                        Close
                    </Button>

                </DialogActions>

            </Dialog>

        </div>
    );

}

export default EventDialog;

