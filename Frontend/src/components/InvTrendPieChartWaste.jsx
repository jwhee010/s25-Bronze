import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import './InvTrendPieChartWaste.css'

export default function InvTrendPieChartWaste(){
    return(
    <PieChart
    series={[

        {
            data:[
                { id:0, value: 5, label:'Tomato'},
                { id:1, value: 3, label:'Fish'},
                { id:2, value: 2, label: 'Chips'},
                {id:3, value: 6, label:'a'},
                {id: 4,value: 9, label:':('}
            ]

        }
    ]
    }
    width={400}
    height={200}
    
    
    />






    )

}