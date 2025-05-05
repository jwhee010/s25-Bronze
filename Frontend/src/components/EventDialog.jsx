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
function EventDialog({open, onClose}) {
    // const [open, setOpen] = useState(true);
    // // const[eventName] = props;

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    const [consumedItems, setConsumedItems] = useState([]);
    const [wastedItems, setWastedItems] = useState([]);
    const [reportData, setReportData] = useState  ({
        good: [],
        okay: [],
        bad: [],
        shoppingList: [],
    });

    function processItems(consumedItems, wastedItems) {
        const itemMap = {};
        const shoppingList = [];

        consumedItems.forEach(item => {
            if (!itemMap[item.FoodItemID]) {
                itemMap[item.FoodItemID] = { FoodName: item.FoodName, consumed: 0, wasted: 0 };
            }
            itemMap[item.FoodItemID].consumed += item.Quantity;
        });

        wastedItems.forEach(item => {
            if (!itemMap[item.FoodItemID]) {
                itemMap[item.FoodItemID] = { FoodName: item.FoodName, consumed: 0, wasted: 0 };
            }
            itemMap[item.FoodItemID].wasted += item.Quantity;
        });

        const good = [];
        const okay = [];
        const bad = [];

        // this is the base case
        if (consumedItems.length === 0 && wastedItems.length === 0) {
            return {
                good: [],
                okay: [],
                bad: [],
                shoppingList: [],
                message: "No data to report on!" 
            };
        }

        Object.entries(itemMap).forEach(([id, { FoodName, consumed, wasted }]) => {
            const total = Number(consumed) + Number(wasted);

            // This part accounts for no data to report
            if (total === 0) return (
                <h2>Insufficient data to report on. Start eating!</h2>
            );

            const percentage = consumed / total;
            const percentStr = Math.round(percentage * 100);

            const standardQuantity = 10;
            const recommendedQuantity = Math.round(standardQuantity * percentage);
            console.log(recommendedQuantity);

            const shoppingItem = (
                <span>
                    <span style={{ color: 'rgb(255, 242, 168)', fontWeight: 'bold'}}>{FoodName}</span> - We recommend you buy 
                    <span style={{ color: 'rgb(255, 242, 168)', fontWeight: 'bold'}}> {recommendedQuantity}</span> servings
                </span>
            );

            if (consumed === 0) {
                bad.push(<span className='basicReportText'>
                    <span className='badItem'>{FoodName}</span> – your wastage rate is <span className='badItem'>100%</span>.
                </span>)
            } else if (wasted === 0) {
                good.push(<span className='basicReportText'>
                    <span className='goodItem'>{FoodName}</span> – your consumption rate is <span className='goodItem'>100%</span>!
                </span>)
                shoppingList.push(shoppingItem);
            } else if (percentage >= 0.7) {
                good.push(<span className='basicReportText'>
                    <span className='goodItem'>{FoodName}</span> – your consumption rate is <span className='goodItem'>{percentStr}%</span>.
                </span>);
                shoppingList.push(shoppingItem);
            } else if (percentage >= 0.5) {
                okay.push(<span className='basicReportText'>
                    <span className='okayItem'>{FoodName}</span> – your consumption rate is <span className='okayItem'>{percentStr}%</span>.
                </span>);
                shoppingList.push(shoppingItem);
            } else {
                const wastePercent = Math.round((wasted / total) * 100);
                bad.push(<span className='basicReportText'>
                    <span className='badItem'>{FoodName}</span> – your wastage rate is <span className='badItem'>{wastePercent}%</span>.
                </span>);
            }
        });

        return { good, okay, bad, shoppingList };
    };

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
        
        const processData = async () => {
            try {
                getConsumedItems(token);
                getWastedItems(token);
    
                const [consumedResult, wastedResult] = await Promise.all([
                    axios.get('http://localhost:80/consumedData', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:80/wastedData', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);
    
                const consumedItems = consumedResult.data.consumedItems;
                const wastedItems = wastedResult.data.wastedItems;
    
                setConsumedItems(consumedItems);
                setWastedItems(wastedItems);
    
                const processed = processItems(consumedItems, wastedItems);
                setReportData(processed);
            } catch (error){
            console.error('An error occured while retrieving report data.', error);
            }
        };
        try {
            getConsumedItems(token);
            getWastedItems(token);

        } catch (error) {
            console.error('An error occured while retrieving report data.', error);
        }

        processData();
    }, []);


    return (

        <div>

            {/* --Dashboard button-- */}


            <Dialog open={open} onClose={onClose}>

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
                        {/*<h1 className='diaContHeadr'>Shopping?</h1>

                        <p>Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                        </p>*/}

                        {/*<h1 className="diaContHeadr">You Have Items Expiring Soon</h1>

                        <p>!Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                            !Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test Test!
                        </p>*/}

                        <h1 className="diaContHeadr">Your Waste Habits</h1>

                           {/*{reportData.good.length > 0 && (
                                <>
                                    <h2 className='diaContSubHeader'>You&apos;re doing <b style={{ color: 'rgb(41, 164, 41)' }}>good</b> with:</h2>
                                    <h3 className='diaContSubHeader2'>
                                        (It&apos;s okay to buy more of these)
                                    </h3>
                                    <ul>{reportData.good.map((message, i) => <li key={`good-${i}`}>{message}</li>)}</ul>
                                </>
                            )}

                            {reportData.okay.length > 0 && (
                                <>
                                    <h2 className='diaContSubHeader'>You&apos;re doing <b style={{ color: 'yellow' }}>okay</b> with:</h2>
                                    <h3 className='diaContSubHeader2'>
                                        (It&apos;s okay to buy these, but try not to buy as much)
                                    </h3>
                                    <ul>{reportData.okay.map((message, i) => <li key={`okay-${i}`}>{message}</li>)}</ul>
                                </>
                            )}

                            {reportData.bad.length > 0 && (
                                <>
                                    <h2 className='diaContSubHeader'>You&apos;re doing  <b style={{ color: 'red' }}>bad</b> with:</h2>
                                    <h3 className='diaContSubHeader2'>
                                        (Maybe reconsider buying these)
                                    </h3>
                                    <ul>{reportData.bad.map((message, i) => <li key={`bad-${i}`}>{message}</li>)}</ul>
                                </>
                            )}*/}

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

                                    {reportData.message && <h2>{reportData.message}</h2>}

                                    {!reportData.message && (<>

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
                                    </>)}
                                </div>
                            );
                        })()}

                        {reportData.shoppingList.length > 0 && ( <>
                            <h1 className='diaContHeadr'>Shopping?</h1>

                            <p className='diaContSubHeader'>Here are some foods we recommend you buy - you have been using more of them than you wasted!</p>
                            <ul>
                                {reportData.shoppingList.map((item, i) => (
                                    <li key={`shop-${i}`}>{item}</li>
                                ))}
                            </ul>
                        </> )}
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
                    <Button variant="contained" onClick={onClose} sx={{ m: 'auto', background: "#5fba76" }}>
                        Close
                    </Button>

                </DialogActions>

            </Dialog>

        </div>
    );

}

export default EventDialog;

