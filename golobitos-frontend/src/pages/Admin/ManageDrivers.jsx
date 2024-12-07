import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBan, faThumbsUp, faThumbsDown, faUser, faArrowLeft, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { useLanguage } from '../../context/LanguageContext';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const translations = {
  en: {
    manageDrivers: 'Manage Drivers',
    searchDriver: 'Search Driver',
    totalTrips: 'Total Trips Over Time',
    revenue: 'Revenue Over Time',
    canceledTrips: 'Canceled Trips Over Time',
    feedback: 'Feedback',
    banDriver: 'Ban Driver',
    selectDuration: 'Select Ban Duration',
    reason: 'Reason for Ban',
    status: 'Status: Active',
    week: '1 Week',
    month: '1 Month',
    months: '6 Months',
    lifetime: 'Lifetime',
  },
  es: {
    manageDrivers: 'Gestionar Conductores',
    searchDriver: 'Buscar Conductor',
    totalTrips: 'Total de Viajes en el Tiempo',
    revenue: 'Ingresos en el Tiempo',
    canceledTrips: 'Viajes Cancelados en el Tiempo',
    feedback: 'Retroalimentación',
    banDriver: 'Prohibir Conductor',
    selectDuration: 'Seleccionar Duración de la Prohibición',
    reason: 'Razón para la Prohibición',
    status: 'Estado: Activo',
    week: '1 Semana',
    month: '1 Mes',
    months: '6 Meses',
    lifetime: 'Toda la vida',
  },
};

const ManageDrivers = () => {
  const { language, setLanguage } = useLanguage(); // Corrected the destructuring
  const t = translations[language]; // Dynamically use translations based on the current language

  const [driverData, setDriverData] = useState({
    username: '',
    feedback: [
      { rating: 5, comment: 'Excellent service!' },
      { rating: 2, comment: 'Rude behavior.' },
      { rating: 3, comment: 'Late but polite.' },
    ],
    trips: [
      { tripId: '001', status: 'Completed', date: '2024-11-05', revenue: 50 },
      { tripId: '002', status: 'Cancelled', date: '2024-11-06', revenue: 0 },
      { tripId: '003', status: 'Completed', date: '2024-11-07', revenue: 40 },
    ],
    performance: { totalTrips: 10, canceledTrips: 1, averageRating: 4.2 },
    banDuration: '',
    banReason: '',
  });

  const [searchMode, setSearchMode] = useState(false); // Toggle search form
  const [showDriverDetails, setShowDriverDetails] = useState(false); // Display driver details after search

  const handleBan = () => {
    alert(`Driver ${driverData.username} banned for ${driverData.banDuration} due to: ${driverData.banReason}`);
  };

  const handleSearchDriver = () => {
    setDriverData({ ...driverData, username: 'John Doe' }); // Mocked search result
    setShowDriverDetails(true); // Show driver details section
    setSearchMode(false); // Close search form
  };

  const totalTripsData = {
    labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'],
    datasets: [
      {
        label: 'Total Trips',
        data: [80, 120, 100, 90, 150],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const revenueData = {
    labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1000, 1200, 950, 1100, 1400],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const canceledTripsData = {
    labels: ['2024-11-01', '2024-11-02', '2024-11-03', '2024-11-04', '2024-11-05'],
    datasets: [
      {
        label: 'Canceled Trips',
        data: [5, 3, 7, 2, 4],
        backgroundColor: '#F44336',
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl mb-2">
            Go
          </div>
          <h1 className="text-2xl font-bold text-white">{t.manageDrivers}</h1>
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
          className="flex items-center bg-yellow-400 text-[#027f86] px-3 py-1 rounded-lg hover:bg-yellow-500 transition-all"
        >
          <FontAwesomeIcon icon={faGlobe} className="mr-2" />
          {language === 'en' ? 'Español' : 'English'}
        </button>
      </div>

      {/* Search Button */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setSearchMode(true)}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all"
        >
          <FontAwesomeIcon icon={faSearch} className="mr-2" />
          {t.searchDriver}
        </button>
      </div>

      {/* Search Driver Form */}
      {searchMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg w-96">
            <button onClick={() => setSearchMode(false)} className="absolute top-2 right-2 text-lg">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">{t.searchDriver}</h2>
            <label className="block mb-3">
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                placeholder="Enter driver's username or email"
                value={driverData.username}
                onChange={(e) => setDriverData({ ...driverData, username: e.target.value })}
              />
            </label>
            <button
              onClick={handleSearchDriver}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Driver Performance Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Trips Over Time */}
        <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-2">{t.totalTrips}</h3>
          <Line data={totalTripsData} />
        </div>

        {/* Revenue Over Time */}
        <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-2">{t.revenu}</h3>
          <Line data={revenueData} />
        </div>

        {/* Canceled Trips Over Time */}
        <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium mb-2">{t.canceledTrips}</h3>
          <Bar data={canceledTripsData} />
        </div>
      </div>

      {/* Driver Details (Display after search) */}
      {showDriverDetails && (
        <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto mt-6">
          <div className="text-center mb-4">
            <FontAwesomeIcon icon={faUser} className="text-4xl text-[#027f86] mb-2" />
            <h2 className="font-bold">{driverData.username || 'Driver Name'}</h2>
            <p className="text-lg">{t.status}</p>
          </div>

          {/* Driver Feedback */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{t.feedback}</h3>
            {driverData.feedback.map((fb, index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
                <span className={`font-semibold ${fb.rating >= 4 ? 'text-green-500' : fb.rating === 3 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {fb.rating >= 4 ? <FontAwesomeIcon icon={faThumbsUp} /> : <FontAwesomeIcon icon={faThumbsDown} />}
                </span>
                <p className="ml-2">{fb.comment}</p>
              </div>
            ))}
          </div>

          {/* Ban Driver */}
          <div className="mb-6">
            <label className="block mb-3">
              <span className="text-lg font-medium">{t.banDriver}</span>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                onChange={(e) => setDriverData({ ...driverData, banDuration: e.target.value })}
              >
                <option value="">{t.selectDuration}</option>
                <option value="1 Week">{t.week}</option>
                <option value="1 Month">{t.month}</option>
                <option value="6 Months">{t.months}</option>
                <option value="Lifetime">{t.lifetime}</option>
              </select>
            </label>
            <label className="block mb-3">
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-700"
                placeholder={t.reason}
                onChange={(e) => setDriverData({ ...driverData, banReason: e.target.value })}
              />
            </label>
            <button
              onClick={handleBan}
              className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              <FontAwesomeIcon icon={faBan} className="mr-2" />
              {t.banDriver}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDrivers;
