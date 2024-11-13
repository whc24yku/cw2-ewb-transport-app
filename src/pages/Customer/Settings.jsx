// src/pages/Customer/Settings.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faPalette, faShieldAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const CustomerSettings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    transactionAlerts: true,
    emergencyUpdates: false,
  });

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col items-center overflow-hidden m-0 p-0 box-border">
      {/* Header with Logo */}
      <header className="w-full max-w-3xl p-4 flex flex-col items-center m-0 box-border">
        {/* Logo and Title */}
        <div className="flex items-center w-full justify-start mb-2">
          <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
            Go
          </div>
          <h1 className="text-lg font-semibold text-white ml-2">GoLobitos</h1>
        </div>

        {/* Centered "Settings" Heading */}
        <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-4">
          Settings
        </h2>
      </header>

      {/* Main Content Box */}
      <div className="flex-grow w-full max-w-3xl bg-white text-[#027f86] rounded-lg shadow-lg p-4 overflow-y-auto box-border m-0 max-h-[75vh]">
        
        {/* Profile Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
            Profile Information
          </h2>
          <div className="space-y-3">
            <input type="text" placeholder="Full Name" className="w-full p-2 border rounded-lg focus:outline-none" />
            <input type="email" placeholder="Email Address" className="w-full p-2 border rounded-lg focus:outline-none" />
            <input type="tel" placeholder="Phone Number" className="w-full p-2 border rounded-lg focus:outline-none" />
          </div>
        </div>

        {/* App Preferences */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faPalette} className="mr-2 text-purple-500" />
            App Preferences
          </h2>
          <div className="flex items-center mb-3">
            <label className="mr-3">Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="transform scale-125 cursor-pointer"
            />
          </div>
          <select className="w-full p-2 border rounded-lg focus:outline-none">
            <option value="en">Language: English</option>
            <option value="es">Language: Spanish</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faBell} className="mr-2 text-purple-500" />
            Notification Settings
          </h2>
          <div className="flex items-center mb-3">
            <label className="mr-3">Transaction Alerts</label>
            <input
              type="checkbox"
              checked={notifications.transactionAlerts}
              onChange={() => setNotifications({ ...notifications, transactionAlerts: !notifications.transactionAlerts })}
              className="transform scale-125 cursor-pointer"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-3">Emergency Updates</label>
            <input
              type="checkbox"
              checked={notifications.emergencyUpdates}
              onChange={() => setNotifications({ ...notifications, emergencyUpdates: !notifications.emergencyUpdates })}
              className="transform scale-125 cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-purple-500" />
            Privacy Options
          </h2>
          <div className="flex items-center mb-3">
            <label className="mr-3">Show Availability</label>
            <input
              type="checkbox"
              checked={notifications.showAvailability}
              onChange={() => setNotifications({ ...notifications, showAvailability: !notifications.showAvailability })}
              className="transform scale-125 cursor-pointer"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-3">Share Location</label>
            <input
              type="checkbox"
              checked={notifications.shareLocation}
              onChange={() => setNotifications({ ...notifications, shareLocation: !notifications.shareLocation })}
              className="transform scale-125 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button className="bg-yellow-300 text-[#027f86] px-5 py-2 rounded-lg hover:bg-yellow-400 transition-all inline-flex items-center">
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
