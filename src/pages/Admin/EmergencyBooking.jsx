// src/pages/Admin/EmergencyConfirmation.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmbulance, faCar, faCheckCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';

const AdminEmergencyBooking = () => {
  const [status, setStatus] = useState('Awaiting Driver'); // Possible states: 'Awaiting Driver', 'Driver On Route', 'Complete'
  const [onBehalfOf, setOnBehalfOf] = useState(''); // State for On Behalf Of field

  // Function to simulate alerting driver
  const handleAlertDriver = () => {
    setStatus('Awaiting Driver');
    setTimeout(() => setStatus('Driver On Route'), 3000); // Simulate driver on route after 3 seconds
    setTimeout(() => setStatus('Complete'), 10000); // Simulate completion after 10 seconds
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white flex flex-col items-center overflow-hidden m-0 p-0 box-border">
      {/* Centered Logo and Title */}
      <div className="flex flex-col items-center mb-6 px-4 md:px-0">
        <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl mb-2">
          Go
        </div>
        <h1 className="text-2xl font-bold text-white">GoLobitos Emergency</h1>
      </div>

      {/* Emergency Details Form */}
      <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg max-w-lg w-full mt-4 mx-auto m-0 box-border">
        <h2 className="text-2xl font-semibold text-center mb-6">Emergency Booking Details</h2>
        
        {/* Medical Type */}
        <label className="block mb-3">
          <span className="text-lg font-medium">Emergency Type</span>
          <select className="w-full mt-2 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none">
            <option>Medical - Critical</option>
            <option>Medical - Non-Critical</option>
            <option>Fire Emergency</option>
            <option>Police Assistance</option>
            <option>Natural Disaster</option>
          </select>
        </label>

        {/* Preferred Vehicle */}
        <label className="block mb-6">
          <span className="text-lg font-medium">Preferred Vehicle</span>
          <select className="w-full mt-2 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none">
            <option>Ambulance</option>
            <option>Rescue Truck</option>
            <option>Police Car</option>
            <option>Fire Engine</option>
          </select>
        </label>

        {/* On Behalf Of */}
        <label className="block mb-6">
          <span className="text-lg font-medium">On Behalf Of (Username/Email)</span>
          <input 
            type="text" 
            className="w-full mt-2 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none"
            value={onBehalfOf}
            onChange={(e) => setOnBehalfOf(e.target.value)}
            placeholder="Enter username or email"
          />
        </label>

        {/* Alert Driver Button */}
        <button
          onClick={handleAlertDriver}
          className="w-full bg-red-500 text-white text-lg py-3 rounded-lg hover:bg-red-600 transition-all"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          Alert Driver
        </button>
      </div>

      {/* Live Status Update */}
      <div className="w-full max-w-lg mt-8 mx-auto m-0 p-0 box-border">
        <h2 className="text-xl font-semibold text-center mb-4">Live Status</h2>
        <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg flex items-center justify-center space-x-4">
          {status === 'Awaiting Driver' && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-yellow-500 text-2xl" />
              <span className="text-lg font-medium">Awaiting Driver...</span>
            </div>
          )}
          {status === 'Driver On Route' && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCar} className="text-green-500 text-2xl" />
              <span className="text-lg font-medium">Driver On Route</span>
            </div>
          )}
          {status === 'Complete' && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-2xl" />
              <span className="text-lg font-medium">Complete</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmergencyBooking;
