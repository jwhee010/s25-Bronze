import React, { useState, useEffect } from 'react'; // Import React hooks
import { PieChart } from '@mui/x-charts/PieChart'; // Import PieChart
import { BarChart } from '@mui/x-charts/BarChart'; // Import BarChart
import './ShareAnalytics.css'; // Import CSS styles
import axios from 'axios'; // Import Axios for API calls

export default function ShareAnalytics() {
    const [topSharedFood, setTopSharedFood] = useState([]); // State to store pie chart data

    // Retrieves the top 5 most shared food items from the database
    const getTopSharedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/Sharing/Analytics', {
                headers: {
                    Authorization: `Bearer ${token}`, // Authorization header
                },
            });

            // Map response data to match PieChart requirements
            const pieChartData = response.data.Analytics.map((item, index) => ({
                id: index, // Unique ID for each slice
                value: item.Quantity, // Quantity of shared food
                label: item.FoodName, // Food name as label
            }));

            setTopSharedFood(pieChartData); // Update state with formatted data
        } catch (error) {
            console.error('Error retrieving food items:', error); // Log errors
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken'); // Retrieve token from local storage
        if (!token) {
            console.error('No auth token found in localStorage'); // Handle missing token
            return;
        }
        getTopSharedFood(token); // Fetch data when component mounts
    }, []);

    return (
        <div className="analytics-container">
            {/* Pie Chart Section */}
            <div className="chart-container pie-section">
                <h2 className="chart-title">Top 5 Most Shared Food Items</h2>
                <PieChart
                    colors={['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0']} // Custom colors
                    series={[
                        {
                            data: topSharedFood.length > 0
                                ? topSharedFood
                                : [{ id: 0, value: 1, label: 'No shared food!' }], // Handle empty state
                        },
                    ]}
                    slotProps={{
                        legend: {
                            labelStyle: {
                                fontSize: 14,
                                fill: 'white', // Customize legend label
                            },
                        },
                    }}
                    width={400}
                    height={200}
                />
            </div>

            {/* Bar Chart Section */}
            <div className="chart-container bar-section">
                <h2 className="chart-title">Total Shared Quantity Per Food Item</h2>
                <BarChart
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: ['Apples', 'Bananas', 'Carrots', 'Tomatoes', 'Potatoes'], // Placeholder data
                        },
                    ]}
                    series={[
                        {
                            data: [10, 15, 8, 12, 6], // Placeholder values
                            color: ['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0'], // Individual bar colors
                        },
                    ]}
                    height={300} // Set Bar Chart height
                />
            </div>
        </div>
    );
}
