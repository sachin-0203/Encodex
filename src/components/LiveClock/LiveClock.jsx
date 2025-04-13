import React, { useEffect, useState } from 'react';

function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time like "12:19:50 PM"
  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Format date like "Sun 11 DEC 2024"
  const weekday = currentTime.toLocaleDateString('en-US', { weekday: 'short' });
  const day = currentTime.getDate().toString().padStart(2, '0');
  const month = currentTime.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = currentTime.getFullYear();

  return (
    <div>
      <h2>{timeString}</h2>
      <h2>
        <span>{weekday}</span> {day} {month} {year}
      </h2>
    </div>
  );
}

export default LiveClock;
