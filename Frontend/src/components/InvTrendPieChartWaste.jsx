import { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './InvTrendPieChartWaste.css'
import axios from 'axios';

export default function InvTrendPieChartWaste() {

    const [topWastedFood, setTopWastedFood] = useState([]);

    // retrieves the five most wasted food items from the database
    const getTopWastedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/topWaste', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const pieChartData = response.data.foodItems.map((item, index) => ({
                id: index,
                value: item.Quantity, // Set the waste quantity as value
                label: item.FoodName // Set the food name as label
            }));

            setTopWastedFood(pieChartData);
        }

        catch (error) {
            console.error('Error retrieving food items:', error)
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');

        try {
            getTopWastedFood(token);
        } catch (error) {
            console.error('Token decoding error:', error);
        }
    }, []);

    return (
        <PieChart
            series={[
                {
                    // This sets the pie chart data as the 
                    // items retreived from the database.

                    // If there aren't any wasted items, then it
                    // displays placeholder information that
                    // congratulates the user
                    data: topWastedFood.length > 0 ? topWastedFood : [
                        { id: 0, value: 1, label: 'No wasted food!' }
                    ]
                }
            ]}
            width={400}
            height={200}
        />

    )

}