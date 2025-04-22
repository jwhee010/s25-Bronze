import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import './ShareAnalytics.css';
import axios from 'axios';

const ShareBarChart = () => {
    const [allSharedFood, setAllSharedFood] = useState([]);

    const getAllSharedFood = async (token) => {
        try {
            const response = await axios.get('http://localhost:80/Sharing/AllAnalytics', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const barChartData = response.data.Analytics.map(item => ({
                label: item.FoodName,
                value: item.Quantity,
            }));

            setAllSharedFood(barChartData);
        } catch (error) {
            console.error('Error fetching shared food:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found in localStorage');
            return;
        }
        getAllSharedFood(token);
    }, []);

    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: allSharedFood.map(item => 
                item.label.length >= 8 ? item.label.slice(0, 7) + '.' : item.label) }]} 
                // the above part makes names that are 8 characters or longer into shorter version
            series={[{ data: allSharedFood.map(item => item.value),
                color: '#6ab07f',
             }]}
            height={300}
        />
    );
};

export default ShareBarChart;