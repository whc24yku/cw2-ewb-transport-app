// src/pages/Driver/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faPlus, faLocationArrow } from '@fortawesome/free-solid-svg-icons';

const DriverDashboard = () => {
  const [trips, setTrips] = useState([]);
  const [location, setLocation] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showTripModal, setShowTripModal] = useState(false);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropoffPoint, setDropoffPoint] = useState('');

  useEffect(() => {
    const handleOfflineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOfflineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOfflineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  const syncTrips = () => {
    alert('Trips synced successfully!');
    setTrips([]);
  };

  const addTrip = () => {
    if (pickupPoint && dropoffPoint) {
      const newTrip = {
        id: trips.length + 1,
        pickup: pickupPoint,
        dropoff: dropoffPoint,
        status: 'Pending',
      };
      setTrips([...trips, newTrip]);
      setPickupPoint('');
      setDropoffPoint('');
      setShowTripModal(false); // Close modal after adding the trip
    } else {
      alert('Please fill in both pickup and dropoff points.');
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => alert('Failed to fetch location')
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white p-6 flex flex-col items-center justify-center">
      {/* Go Logo */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
          Go
        </div>
        <h1 className="text-lg font-semibold text-white ml-3">GoLobitos</h1>
      </div>

      <h2 className="text-2xl font-bold mb-6">Driver Dashboard</h2>

      {/* Offline Status Message */}
      {isOffline && (
        <div className="mb-4 p-4 bg-red-500 rounded-lg">
          <p>You are currently offline. Some features may be limited.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={syncTrips}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full"
        >
          <FontAwesomeIcon icon={faSync} className="mr-2" />
          Sync Trips
        </button>
        <button
          onClick={() => setShowTripModal(true)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Start New Trip
        </button>
        <button
          onClick={fetchLocation}
          className="bg-purple-500 text-white py-2 px-4 rounded-lg flex items-center justify-center w-full"
        >
          <FontAwesomeIcon icon={faLocationArrow} className="mr-2" />
          Fetch Location
        </button>
      </div>

      {/* Location Display */}
      {location && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold">Current Location</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      {/* Trip List */}
      <div className="mt-8 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-4">Pending Trips</h3>
        {trips.length === 0 ? (
          <p className="text-center">No pending trips.</p>
        ) : (
          <ul className="space-y-2">
            {trips.map((trip) => (
              <li
                key={trip.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
              >
                <span>Trip #{trip.id}</span>
                <span>{trip.status}</span>
                <span>{trip.pickup} → {trip.dropoff}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for Starting New Trip */}
      {showTripModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-black">Start New Trip</h3>
            <div className="mb-4">
              <label htmlFor="pickup" className="block text-black mb-2">Pickup Point</label>
              <input
                id="pickup"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dropoff" className="block text-black mb-2">Dropoff Point</label>
              <input
                id="dropoff"
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                value={dropoffPoint}
                onChange={(e) => setDropoffPoint(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowTripModal(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addTrip}
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Add Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
