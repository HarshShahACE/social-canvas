import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js/auto';

// Define the type for the data
interface LocationData {
  urn_id: string;
  distance: string | number;
  jobtitle: string | null;
  location: string;
  name: string;
}

interface Props {
  locationData: LocationData[] | null;
}

const BarChart: React.FC<Props> = ({ locationData }) => {
  const [data, setData] = useState<LocationData[]>([]);

  useEffect(() => {
    if (locationData) {
      setData(locationData);
    }
  }, [locationData]);

  const generateChartData = () => {
    if (!data) return { labels: [], datasets: [] }; // Return empty data if no data available

    // Group data by job title and count occurrences of each job title
    const groupedData: { [key: string]: number } = {};
    data.forEach(item => {
      const jobTitle = item.jobtitle || 'Unknown';
      if (!groupedData[jobTitle]) {
        groupedData[jobTitle] = 0;
      }
      groupedData[jobTitle]++;
    });

    // Sort the grouped data by count in descending order
    const sortedData = Object.entries(groupedData)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 10); // Take the top 15 job roles

    // Extract labels and values from the sorted data
    const labels = sortedData.map(([jobTitle]) => jobTitle);
    const values = sortedData.map(([, count]) => count);

    const dataset = {
      label: 'Job Titles',
      data: values,
      backgroundColor: `rgba(33, 150, 243, 0.8)`, // Darker blue color with transparency
      borderColor: `rgba(33, 150, 243, 1)`, // Darker blue color
      borderWidth: 1,
    };

    return { labels, datasets: [dataset] };
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        min: 1, // Set minimum value on x-axis to 1
        max: 60, // Set maximum value on x-axis to 60
        title: {
          display: true,
          text: 'Count',
        },
        ticks: {
          color: 'white', // Set font color of x-axis labels to red
          font: {
            size: 10, // Set font size to 10
          },
        },
      },
      y: {
        title: {
          display: true,
        },
        ticks: {
          color:'white',
          font: {
            size: 10, // Set font size to 10
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 10, // Set font size to 10
          },
        },
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(33, 150, 243, 0.8)', // Darker blue color with transparency
        borderColor: 'white', // Set border color of the bars to white
        borderWidth: 1,
      },
    },
    // Set the background color of the chart area to white
    backgroundColor: 'white',
    borderColor:'white'
  };

  return (
    <div style={{ margin: 'auto', height: '600px' }}> {/* Set the width and height of the chart container */}
      <h2>Top 10 Job Titles</h2>
      {data.length > 0 && <Bar data={generateChartData()} options={options} />}
    </div>
  );
};

export default BarChart;
