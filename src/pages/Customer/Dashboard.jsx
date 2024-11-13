import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faShoppingBasket, faAmbulance, faCog, faPhone, faEnvelope, faUserEdit,
  faChevronDown, faChevronUp, faWallet, faHistory
} from '@fortawesome/free-solid-svg-icons';

const CustomerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // Track offline status
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect online/offline status
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Function to save data offline
  const saveDataOffline = (key, data) => {
    if (isOffline) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      // Sync with the server if online
      console.log('Syncing data to the server');
    }
  };

  // Function to load offline data
  const loadDataOffline = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // Function to show notification if offline
  const OfflineNotification = () => {
    if (isOffline) {
      return (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center p-2">
          You are offline. Your data will be saved locally and synced once you're online.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-hidden m-0 p-0">
      {/* Offline Notification */}
      <OfflineNotification />

      {/* Navbar */}
      <header className="flex items-center justify-between p-4 bg-[#027f86] shadow-lg">
        <div className="flex items-center ml-4">
          <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
            Go
          </div>
          <h1 className="text-lg font-semibold text-white ml-3">GoLobitos</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex items-center space-x-4 mr-4">
          <button onClick={() => navigate('/about')} className="text-white hover:text-yellow-300 transition-all">
            About Us
          </button>
          <button onClick={() => navigate('/contact')} className="text-white hover:text-yellow-300 transition-all">
            Contact
          </button>

          {/* Dropdown for Account (Credits, History, Edit Profile) */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-yellow-400 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-500 transition-all"
            >
              <FontAwesomeIcon icon={faUserEdit} />
              <span>Account</span>
              <FontAwesomeIcon icon={showDropdown ? faChevronUp : faChevronDown} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-100 rounded-lg shadow-lg z-10 text-[#027f86]">
                <button className="flex items-center w-full px-4 py-2 hover:bg-yellow-300" onClick={() => setShowDropdown(false)}>
                  <FontAwesomeIcon icon={faWallet} className="mr-2" />
                  Credits Balance
                </button>
                <button className="flex items-center w-full px-4 py-2 hover:bg-yellow-300" onClick={() => setShowDropdown(false)}>
                  <FontAwesomeIcon icon={faHistory} className="mr-2" />
                  Transaction History
                </button>
                <button onClick={() => navigate('/edit-profile')} className="flex items-center w-full px-4 py-2 hover:bg-yellow-300">
                  <FontAwesomeIcon icon={faUserEdit} className="mr-2" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button onClick={() => navigate('/login')} className="bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all">
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-yellow-300 text-center mb-4">
            Welcome, {user?.email || 'Guest'}!
          </h1>
          <p className="text-lg text-center text-white mb-6">
            Explore all the features and services GoLobitos has to offer.
          </p>
        </div>

        {/* Service Options */}
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto px-6">
          <div
            onClick={() => {
              const transportData = { destination: 'New York', pickup: 'LA' };
              saveDataOffline('transportBooking', transportData);
              navigate('/customer/book-transport');
            }}
            className="flex flex-col items-center justify-center p-6 bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCar} size="2x" />
            <span className="mt-4 font-semibold">Book Transport</span>
          </div>
          <div
            onClick={() => navigate('/customer/marketplace')}
            className="flex flex-col items-center justify-center p-6 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faShoppingBasket} size="2x" />
            <span className="mt-4 font-semibold">Marketplace</span>
          </div>
          <div
            onClick={() => navigate('/customer/emergency-confirmation')}
            className="flex flex-col items-center justify-center p-6 bg-red-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faAmbulance} size="2x" />
            <span className="mt-4 font-semibold">Emergency</span>
          </div>
          <div
            onClick={() => navigate('/customer/settings')}
            className="flex flex-col items-center justify-center p-6 bg-yellow-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCog} size="2x" />
            <span className="mt-4 font-semibold">Settings</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#027f86] p-4 text-white text-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faPhone} />
            <span className="text-gray-300">+123 456 7890</span>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faEnvelope} />
            <span className="text-gray-300">support@golobitos.com</span>
          </div>
          <p className="text-gray-400">&copy; 2023 GoLobitos. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerDashboard;
