// src/pages/Customer/BookTransport.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faFish, faAppleAlt, faHorse, faCar, faHeartbeat, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const CustomerBookTransport = () => {
  const navigate = useNavigate();
  const [transportType, setTransportType] = useState('standard');
  const [vehicleType, setVehicleType] = useState('smallcar');
  const [isPriority, setIsPriority] = useState(false);

  const transportOptions = [
    { value: 'standard', label: 'Standard', icon: faCar },
    { value: 'medical', label: 'Medical Emergency', icon: faHeartbeat },
    { value: 'livestock', label: 'Livestock Transport', icon: faHorse },
    { value: 'food', label: 'Food & Perishables', icon: faAppleAlt },
    { value: 'fish', label: 'Fish & Aquatics', icon: faFish },
    { value: 'general', label: 'General Goods', icon: faTruck },
  ];

  const vehicleOptions = [
    { value: 'smallcar', label: 'Small Car - $10/hour' },
    { value: 'largecar', label: 'Large Car - $15/hour' },
    { value: 'van', label: 'Van - $20/hour' },
    { value: 'truck', label: 'Truck - $30/hour' },
  ];

  const handleBooking = () => {
    console.log({ transportType, vehicleType, isPriority });
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col items-center overflow-hidden p-0 m-0">
      {/* Logo */}
      <div className="flex items-center my-4">
        <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
          Go
        </div>
        <h1 className="text-lg font-semibold text-white ml-2">GoLobitos</h1>
      </div>

      {/* Booking Form */}
      <div className="w-full max-w-lg bg-white text-[#027f86] rounded-lg shadow-lg p-4 mx-2 mb-4 overflow-y-auto box-border max-h-[75vh]">
        <h2 className="text-2xl font-semibold text-center mb-3">Book a Ride</h2>

        {/* Pick-Up and Drop-Off Fields */}
        <div className="mb-3">
          <label className="block text-md mb-1">Pick-Up Location</label>
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Enter pick-up location"
              className="w-full focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-md mb-1">Drop-Off Location</label>
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Enter drop-off location"
              className="w-full focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Transport Type Selector */}
        <div className="mb-3">
          <label className="block text-md mb-1">Transport Type</label>
          <div className="flex flex-wrap gap-2">
            {transportOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTransportType(option.value)}
                className={`p-3 rounded-lg border-2 text-xs ${transportType === option.value ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
              >
                <FontAwesomeIcon icon={option.icon} size="lg" />
                <span className="block mt-1">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Type Selector */}
        <div className="mb-3">
          <label className="block text-md mb-1">Preferred Vehicle</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            className="w-full px-3 py-1 rounded-md border border-gray-300 text-sm focus:outline-none"
          >
            {vehicleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Flag */}
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            checked={isPriority}
            onChange={(e) => setIsPriority(e.target.checked)}
            className="mr-2 h-4 w-4 text-blue-600"
          />
          <label className="text-md">Mark as Emergency (Priority)</label>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={handleBooking}
          className="bg-blue-500 text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-600 transition text-sm"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default CustomerBookTransport;
