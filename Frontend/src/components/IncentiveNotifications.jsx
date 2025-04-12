import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';

export default function IncentiveNotifications() {
  const [incentiveMessages, setIncentiveMessages] = useState([]);

  const checkMilestones = async () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const creationRes = await axios.get('http://localhost:80/getCreationDate', { headers });

      const creationDate = new Date(creationRes.data.creationDate);
      const currentDate = new Date();

      /*takes the difference in years, turns that into months, and adds it to the difference in months to get total time*/
      const difference = (currentDate.getFullYear() - creationDate.getFullYear()) * 12 + (currentDate.getMonth() - creationDate.getMonth());
      /*there was a placeholder joke for morale purposes*/

      const messages = [];

      if (difference >= 12) {
        messages.push("You've been a LivelyShelfs member for one year! You will now have Tier Two benefits applied to your account!");
      } else if (difference >= 3) {
        messages.push("You've been a LivelyShelfs member for three months! You will now have Tier One benefits applied to your account!");
      }

      setIncentiveMessages(messages);
    } catch (error) {
      console.error('Error fetching incentives data:', error);
    }
  };

  useEffect(() => {
    checkMilestones();
  }, []);

  return (
    <>
      {incentiveMessages.map((msg, index) => (
        <div key={index}>
          <p>{msg}</p>
          <Divider />
        </div>
      ))}
    </>
  );
}