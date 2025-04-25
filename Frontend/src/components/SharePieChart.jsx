import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './ShareAnalytics.css';
import axios from 'axios';

const SharePieChart = () => {
    const [topSharedFood, setTopSharedFood] = useState([]);

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
            console.error('Error fetching top shared food:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found in localStorage');
            return;
        }
        getTopSharedFood(token);
    }, []);

    return (
        <PieChart
            colors={['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0']}
            series={[{
                data: topSharedFood.length > 0
                    ? topSharedFood
                    : [{ id: 0, value: 1, label: 'No shared food!' }],
            }]}
            slotProps={{ legend: { labelStyle: { fontSize: 14, fill: 'white' } } }}
            width={400}
            height={200}
        />
    );
};

export default SharePieChart;