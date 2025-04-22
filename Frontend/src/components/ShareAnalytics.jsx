import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import './ShareAnalytics.css';
import axios from 'axios';

export default function ShareAnalytics() {
    const [topSharedFood, setTopSharedFood] = useState([]);
    const [allSharedFood, setAllSharedFood] = useState([]);

    // Retrieves the top 5 most shared food items from the database
    const getTopSharedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/Sharing/Analytics', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const pieChartData = response.data.Analytics.map((item, index) => ({
                id: index,
                value: item.Quantity,
                label: item.FoodName,
            }));

            setTopSharedFood(pieChartData);
        } catch (error) {
            console.error('Error retrieving food items:', error);
        }
    };

    // Retrieves all shared food items from the database
    const getAllSharedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/Sharing/AllAnalytics', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const barChartData = response.data.Analytics.map((item) => ({
                label: item.FoodName, // Food name for x-axis
                value: item.Quantity, // Quantity shared for y-axis
            }));

            setAllSharedFood(barChartData);
        } catch (error) {
            console.error('Error retrieving food items:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found in localStorage');
            return;
        }
        getTopSharedFood(token);
        getAllSharedFood(token);
    }, []);

    return (
        <div className="analytics-container">
            {/* Pie Chart Section */}
            <div className="chart-container pie-section">
                <h2 className="chart-title">Top 5 Most Shared Food Items</h2>
                <PieChart
                    colors={['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0']}
                    series={[
                        {
                            data: topSharedFood.length > 0
                                ? topSharedFood
                                : [{ id: 0, value: 1, label: 'No shared food!' }],
                        },
                    ]}
                    slotProps={{
                        legend: {
                            labelStyle: { fontSize: 14, fill: 'white' },
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
                            data: allSharedFood.length > 0 ? allSharedFood.map((item) => item.label) : [],
                        },
                    ]}
                    series={[
                        {
                            data: allSharedFood.length > 0 ? allSharedFood.map((item) => item.value) : [],
                            // color: allSharedFood.map((_, index) => ['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0'][index % 5]),
                        },
                    ]}
                    height={300}
                />
            </div>
        </div>
    );
}
