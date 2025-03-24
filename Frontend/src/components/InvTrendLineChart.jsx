import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./InvTrendLineChart.css";
import { useState, useEffect } from "react";
import axios from "axios";

const xLable = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// formatted with Prettier VScode extension

export default function InvTrendLineChart() {

  const [expiredItems, setExpiredItems] = useState(new Array(12).fill(0));

  const getExpiredItems = async(token) => {

    console.log(token)
    try {
      const response = await axios.get('http://localhost:80/expired', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const wasteByMonth = new Array(12).fill(0);

      response.data.expiredItems.forEach((item) => {
        const date = new Date(item.DateExpired);
        const month = date.getMonth();
        wasteByMonth[month] += Number(item.Quantity);
      });

      console.log(wasteByMonth);

      setExpiredItems(wasteByMonth);
    }

    catch (error) {
      console.error('Error retrieving expired items:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    try{
      getExpiredItems(token)
    } catch (error) {
      console.error('Token decoding error:', error);
    }
  }, []);

  return (
    <LineChart
      xAxis={[
        {
          scaleType: "point",
          data: xLable,
        },
      ]}
      series={[
        {
          data: expiredItems,
          color: "#ed3a2d",
        },
      ]}
      sx={{
        ".MuiChartsAxis-root .MuiChartsAxis-line": {
          stroke: "#e6f0ff",
        },
        ".MuiChartsAxis-tickLabel": {
          fill: "#e6f0ff",
        },
        ".MuiChartsAxis-tick": {
          stroke: "#e6f0ff",
        },
      }}
      width={500}
      height={300}
      grid={{ vertial: true, horizontal: true }}
    />
  );
}
