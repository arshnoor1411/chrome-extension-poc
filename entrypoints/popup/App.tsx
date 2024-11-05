import React, { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

type ClickData = {
  tag: string;
  id: string;
  classList: string[];
  x: number;
  y: number;
  timestamp: string;
}

const App: React.FC = () => {
  const [clicks, setClicks] = useState<ClickData[]>([]);

  useEffect(() => {
    const fetchClickData = async () => {
      try {
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://googleads.g.doubleclick.net/pagead/viewthroughconversion/962855656/?', {
          headers: {
            'Origin': 'https://www.youtube.com'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setClicks(data.clicks);
        } else {
          console.error('Error fetching click data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching click data:', error);
      }
    };

    fetchClickData();
  }, []);

  return (
    <div>
      <h1>Click Recorder</h1>
      {clicks.length === 0 ? (<p>No clicks Recorded</p>) : (<ul>  {clicks.map((click, index) => (
        <li key={index}>
          Click on <b>{click.tag}</b> at ({click.x}, {click.y}) on {click.timestamp}
        </li>
      ))}</ul>)}
    </div>
  );
}

export default App;
