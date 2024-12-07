// src/pages/Medic/Dashboard.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faFlag, faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MedicDashboard = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Emergency booking for patient John Doe', status: 'new' },
    { id: 2, message: 'Booking confirmed for patient Jane Smith', status: 'read' },
  ]);
  const [flaggedUsers, setFlaggedUsers] = useState(['John Doe', 'Jane Smith']);
  const [showEmergency, setShowEmergency] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'read' } : n));
  };

  const handleFlagUser = (user) => {
    alert(`Flagging user: ${user}`);
  };

  const handleSearch = () => {
    // Assuming a real search would go here (e.g., API call or filtering through users)
    const user = flaggedUsers.find(u => u.toLowerCase().includes(searchTerm.toLowerCase()));
    setSelectedUser(user || 'User not found');
  };

  const handleSaveMedicalDetails = () => {
    alert(`Medical details saved for: ${selectedUser}`);
  };

  // Data for charts (Example: Emergency bookings and patients treated)
  const emergencyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Emergency Bookings',
        data: [5, 8, 3, 6],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const treatedData = {
    labels: ['Completed', 'Cancelled'],
    datasets: [
      {
        data: [15, 3],
        backgroundColor: ['#4CAF50', '#F44336'],
        hoverBackgroundColor: ['#4CAF50', '#F44336'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
            Go
          </div>
          <h1 className="text-lg font-semibold text-white ml-3">GoLobitos</h1>
        </div>

        {/* Notification Bell Icon */}
        <div className="relative">
          <FontAwesomeIcon icon={faBell} className="text-white text-2xl cursor-pointer" />
          {notifications.some((n) => n.status === 'new') && (
            <span className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center">!</span>
          )}
          <div className="absolute top-10 right-0 bg-white text-[#027f86] w-64 p-4 rounded-lg shadow-lg z-10">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-2 my-2 rounded-lg ${notification.status === 'new' ? 'bg-yellow-400' : 'bg-gray-700'}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <span>{notification.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">Medic Dashboard</h2>
      </div>

      {/* User Search */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-lg w-full max-w-lg">
          <FontAwesomeIcon icon={faSearch} className="mr-2 text-[#027f86]" />
          <input
            type="text"
            placeholder="Search Patient..."
            className="flex-grow p-2 text-black rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {/* Selected User and Medical Details Form */}
      {selectedUser && selectedUser !== 'User not found' && (
        <div className="bg-white text-[#027f86] p-4 rounded-lg shadow-lg w-full max-w-lg mx-auto mb-6">
          <h3 className="text-xl font-semibold text-center mb-4">Medical Details for {selectedUser}</h3>
          <div className="mb-4">
            <label className="block mb-2">Diagnosis:</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg"
              placeholder="Enter diagnosis"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Prescription:</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg"
              placeholder="Enter prescription"
            />
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="flex-1">
              <label className="block mb-2">Arrival Time:</label>
              <input
                type="datetime-local"
                className="w-full p-2 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2">Admission Time:</label>
              <input
                type="datetime-local"
                className="w-full p-2 rounded-lg"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Discharge Time:</label>
            <input
              type="datetime-local"
              className="w-full p-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleSaveMedicalDetails}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Save Medical Details
          </button>
        </div>
      )}

      {/* Flagged Users Section */}
      <div className="bg-white text-[#027f86] p-4 rounded-lg shadow-lg w-full max-w-lg mx-auto mb-6">
        <h3 className="text-xl font-semibold text-center mb-4">Flagged Users</h3>
        {flaggedUsers.length > 0 ? (
          flaggedUsers.map((user, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                <span>{user}</span>
              </div>
              <button
                onClick={() => handleFlagUser(user)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <FontAwesomeIcon icon={faFlag} className="mr-2" />
                Flag
              </button>
            </div>
          ))
        ) : (
          <p>No flagged users at the moment.</p>
        )}
      </div>

      {/* Data Visualization (Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Emergency Bookings Chart */}
        <div className="bg-white text-[#027f86] p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Emergency Bookings</h3>
          <Bar data={emergencyData} options={{ responsive: true }} />
        </div>
        {/* Treated vs Cancelled Chart */}
        <div className="bg-white text-[#027f86] p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Treated vs Cancelled</h3>
          <Pie data={treatedData} />
        </div>
      </div>
    </div>
  );
};

export default MedicDashboard;
