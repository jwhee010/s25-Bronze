import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import './ShareAnalytics.css'; 

export default function ShareAnalytics() {


    
    return (
        <div className="analytics-container">
            {/* Pie Chart Section */}
            <div className="chart-container pie-section">
                <h2 className="chart-title">Top 5 Most Shared Food Items</h2>
                <PieChart
                    colors={['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0']}
                    series={[
                        {
                            data: [
                                { id: 0, value: 25, label: 'Apples' },
                                { id: 1, value: 20, label: 'Bananas' },
                                { id: 2, value: 15, label: 'Carrots' },
                                { id: 3, value: 10, label: 'Tomatoes' },
                                { id: 4, value: 5, label: 'Potatoes' },
                            ]
                        }
                    ]}
                    slotProps={{
                        legend: {
                            labelStyle: {
                                fontSize: 14,
                                fill: 'white',
                            }
                        }
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
                            data: ['Apples', 'Bananas', 'Carrots', 'Tomatoes', 'Potatoes'],
                        },
                    ]}
                    series={[
                        {
                            data: [10, 15, 8, 12, 6],
                            color: ['#F05A7E', '#F6C794', '#FFF6B3', '#7C9D96', '#6FC2D0'], // Individual bar colors
                        },
                    ]}
                    height={300}
                />

            </div>
        </div>
    );
}
