import React from 'react';
import './InvTrendLineChart.css'
import { LineChart } from '@mui/x-charts/LineChart';
import { ThemeProvider } from '@emotion/react';






const xLable = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];



export default function InvTrendLineChart(){
    return(

      

        <LineChart
        xAxis={[{
            scaleType: 'point', data:xLable,
        }]}

      series={[
        {
          data: [5, 10, 2, 5, 7, 9, 0 , 2, 4, null, null],
          color:'#ed3a2d'
        },
      ]}

    
     /*  sx={{
        ".MuiChartsAxis-root .MuiChartsAxis-line": {
          fill: '#e6f0ff',
        },
        ".MuiChartsAxis-tickLabel": {
          fill:'#e6f0ff' ,
        },
        ".MuiChartsAxis-tick":{
             fill: '#e6f0ff',
        } 
        }}     
        */


      width={500}
      height={300}

      grid={{vertial:true, horizontal:true}}

        />


    );
}
