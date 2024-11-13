// src/pages/Analytics.jsx

import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  // Sample data for charts
  const revenueData = {
    labels: ['Medical', 'Fire', 'Police', 'Natural Disaster'],
    datasets: [
      {
        label: 'Revenue (in $)',
        data: [15000, 12000, 8000, 5000],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const peakTimeData = {
    labels: ['12 AM', '6 AM', '12 PM', '6 PM', '12 AM'],
    datasets: [
      {
        label: 'Requests (per hour)',
        data: [30, 50, 70, 90, 40],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const vehicleEfficiencyData = {
    labels: ['Ambulance', 'Rescue Truck', 'Police Car', 'Fire Engine'],
    datasets: [
      {
        label: 'Vehicle Efficiency (%)',
        data: [80, 60, 70, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const emergencyTypeDistributionData = {
    labels: ['Medical - Critical', 'Medical - Non-Critical', 'Fire Emergency', 'Police Assistance', 'Natural Disaster'],
    datasets: [
      {
        label: 'Emergency Type Distribution',
        data: [40, 20, 15, 10, 15],
        backgroundColor: ['#FF6347', '#FFD700', '#20B2AA', '#87CEEB', '#8A2BE2'],
        hoverOffset: 4,
      },
    ],
  };

  const customerSatisfactionData = {
    labels: ['Excellent', 'Good', 'Average', 'Poor'],
    datasets: [
      {
        label: 'Customer Feedback',
        data: [50, 30, 15, 5],
        backgroundColor: ['#28a745', '#ffcc00', '#ffc107', '#dc3545'],
        hoverOffset: 4,
      },
    ],
  };

  const evEfficiencyAndCostData = {
    labels: ['Electric Vehicle', 'Diesel Vehicle'],
    datasets: [
      {
        label: 'Cost Reduction (%)',
        data: [30, 10],
        backgroundColor: ['#34D399', '#F87171'],
        borderColor: ['#34D399', '#F87171'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white flex flex-col items-center overflow-hidden m-0 p-0 box-border">
      {/* Centered Logo and Title */}
      <div className="flex flex-col items-center mb-6 px-4 md:px-0">
        <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl mb-2">
          Go
        </div>
        <h1 className="text-2xl font-bold text-white">GoLobitos Analytics</h1>
      </div>

      <div className="w-full overflow-y-auto max-h-screen px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Generation Analysis */}
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Revenue Generation Analysis</h3>
            <Bar data={revenueData} options={{ responsive: true }} />
          </div>

          {/* Peak Time Analysis */}
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Peak Time Analysis</h3>
            <Line data={peakTimeData} options={{ responsive: true }} />
          </div>

          {/* Vehicle Efficiency */}
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Vehicle Utilization and Efficiency</h3>
            <Bar data={vehicleEfficiencyData} options={{ responsive: true }} />
          </div>

          {/* Emergency Type Distribution */}
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Emergency Type Distribution</h3>
            <Pie data={emergencyTypeDistributionData} options={{ responsive: true }} />
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Customer Satisfaction Analysis</h3>
            <Pie data={customerSatisfactionData} options={{ responsive: true }} />
          </div>

          {/* EV Efficiency and Cost Reduction */}
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Efficiency and Cost Reduction Using Electric Vehicles</h3>
            <Bar data={evEfficiencyAndCostData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
