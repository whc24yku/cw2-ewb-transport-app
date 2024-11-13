// src/pages/Admin/AdminDashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faLocationDot, faDollarSign, faUserEdit, faChevronDown, faChevronUp, faWallet, faHistory, faSignOutAlt, faFileDownload, faCar, faAmbulance, faUsersCog, faPhone, faEnvelope, faPieChart
} from '@fortawesome/free-solid-svg-icons';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [stats, setStats] = useState({
    totalBookings: 1500,
    emergencyBookings: 450,
    standardBookings: 1050,
    revenue: 12000,
    topLocations: ['Location A', 'Location B', 'Location C'],
    flaggedRequests: 3,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside of the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGenerateReport = () => {
    alert("Report has been generated! (This is just a placeholder)");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-hidden m-0 p-0">
      {/* Navbar */}
      <header className="flex items-center justify-between p-3 bg-[#027f86] shadow-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg ml-6">
            Go
          </div>
          <h3 className="text-md font-semibold text-white ml-3 whitespace-nowrap">GoLobitos Admin</h3>
        </div>

        {/* Main Navigation */}
        <nav className="flex items-center w-full justify-center space-x-4 ml-20">
          {/* Separate Buttons for Actions (Centered) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/booktransport')}
              className="bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all text-sm"
            >
              <FontAwesomeIcon icon={faCar} />
              &nbsp;Book Transport
            </button>
            <button
              onClick={() => navigate('/admin/emergencybooking')}
              className="bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all text-sm"
            >
              <FontAwesomeIcon icon={faAmbulance} />
              &nbsp;Emergency Booking
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all text-sm"
            >
              <FontAwesomeIcon icon={faChartLine} />
              &nbsp;Analytics
            </button>
            <button
              onClick={() => navigate('/admin/managedrivers')}
              className="bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all text-sm"
            >
              <FontAwesomeIcon icon={faUsersCog} />
              &nbsp;Manage Drivers
            </button>
          </div>
          {/* Right-aligned Account Dropdown, About Us, Contact, and Logout Buttons */}
          <div className="flex items-center space-x-4">
            {/* About Us & Contact */}
            <div className="flex items-center space-x-4 ml-20">
              <button onClick={() => navigate('/about')} className="text-white hover:text-yellow-300 transition-all text-sm ml-20">
                About Us
              </button>
              <button onClick={() => navigate('/contact')} className="text-white hover:text-yellow-300 transition-all text-sm">
                Contact
              </button>
            </div>

            {/* Account Dropdown */}
            <div className="relative inline-block" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all text-sm"
              >
                <FontAwesomeIcon icon={faUserEdit} />
                <span>Account</span>
                <FontAwesomeIcon icon={showDropdown ? faChevronUp : faChevronDown} />
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-100 rounded-lg shadow-lg z-10 text-[#027f86]">
                  <button className="flex items-center w-full px-3 py-2 hover:bg-yellow-300 text-sm" onClick={() => setShowDropdown(false)}>
                    <FontAwesomeIcon icon={faWallet} className="mr-2" />
                    Account Balance
                  </button>
                  <button className="flex items-center w-full px-3 py-2 hover:bg-yellow-300 text-sm" onClick={() => setShowDropdown(false)}>
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />
                    Activity Log
                  </button>
                  <button onClick={() => navigate('/admin/edit-profile')} className="flex items-center w-full px-3 py-2 hover:bg-yellow-300 text-sm">
                    <FontAwesomeIcon icon={faUserEdit} className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content Wrapper */}
      <main className="flex-grow flex flex-col items-center overflow-y-auto">
        <div className="max-w-5xl w-full p-4">
          <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-6">Admin Dashboard Overview</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {/* Statistic Cards */}
            <div className="p-4 bg-white text-[#027f86] rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-md font-semibold">Total Bookings</h3>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="p-4 bg-white text-[#027f86] rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-md font-semibold">Revenue</h3>
              <p className="text-2xl font-bold">${stats.revenue}</p>
            </div>
            <div className="p-4 bg-white text-[#027f86] rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-md font-semibold">Flagged Requests</h3>
              <p className="text-2xl font-bold">{stats.flaggedRequests}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {/* Bookings Trend */}
            <div className="p-4 bg-white text-[#027f86] rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-md font-semibold mb-3">
                <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-500" />
                Bookings Trend
              </h3>
              <div className="w-full" style={{ maxHeight: '250px' }}>
                <Line data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [{
                    label: 'Bookings',
                    data: [500, 600, 700, 800, 900, 850],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    fill: true,
                    tension: 0.4,
                  }]
                }} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { x: { beginAtZero: true } }
                }} />
              </div>
            </div>

            {/* Bookings Breakdown */}
            <div className="p-4 bg-white text-[#027f86] rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-md font-semibold mb-3">
                <FontAwesomeIcon icon={faPieChart} className="mr-2 text-blue-500" />
                Bookings Breakdown
              </h3>
              <div className="w-full" style={{ maxHeight: '250px' }}>
                <Pie data={{
                  labels: ['Standard', 'Emergency'],
                  datasets: [{
                    data: [stats.standardBookings, stats.emergencyBookings],
                    backgroundColor: ['#34a853', '#ea4335'],
                    borderWidth: 1,
                  }]
                }} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }} />
              </div>
            </div>

            <div className="p-4 bg-white text-[#027f86] rounded-xl shadow-md flex flex-col items-center">
              <h3 className="text-md font-semibold mb-3">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-green-500" />
                Revenue Per Month
              </h3>
              <div className="w-full" style={{ maxHeight: '250px' }}>
                <Bar data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  datasets: [{
                    label: 'Revenue ($)',
                    data: [1500, 1700, 1800, 2000, 1900, 2100, 2200],
                    backgroundColor: '#00C853',
                    borderColor: '#00C853',
                    borderWidth: 1,
                  }],
                }} options={{ responsive: true, maintainAspectRatio: true }} />
              </div>
            </div>
          </div>

          

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <button onClick={handleGenerateReport} className="bg-yellow-400 text-[#027f86] px-6 py-2 rounded-lg hover:bg-yellow-500 transition-all">
              Generate Report
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
