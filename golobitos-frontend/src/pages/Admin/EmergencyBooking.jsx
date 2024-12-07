// src/pages/Admin/EmergencyConfirmation.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAmbulance, faCar, faCheckCircle, faExclamationTriangle, faSpinner, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext'; // Import useLanguage

const AdminEmergencyBooking = () => {
  const [status, setStatus] = useState('Awaiting Driver'); // Possible states: 'Awaiting Driver', 'Driver On Route', 'Complete'
  const [onBehalfOf, setOnBehalfOf] = useState(''); // State for On Behalf Of field
  const { language, setLanguage } = useLanguage(); // Get language and setter from context

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en'); // Toggle between English and Spanish
  };

  // Function to simulate alerting driver
  const handleAlertDriver = () => {
    setStatus('Awaiting Driver');
    setTimeout(() => setStatus('Driver On Route'), 3000); // Simulate driver on route after 3 seconds
    setTimeout(() => setStatus('Complete'), 10000); // Simulate completion after 10 seconds
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#027f86] to-[#3a0ca3] text-white flex flex-col items-center overflow-hidden m-0 p-0 box-border">
      {/* Language Switcher Button */}
      <button
        onClick={toggleLanguage}
        className="absolute bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all top-4 right-4 text-xl"
      >
        <FontAwesomeIcon icon={faGlobe} className="mr-2" />
        {language === 'en' ? 'ES' : 'EN'}
      </button>

      {/* Centered Logo and Title */}
      <div className="flex flex-col items-center mb-6 px-4 md:px-0">
        <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl mb-2">
          Go
        </div>
        <h1 className="text-2xl font-bold text-white">
          {language === 'en' ? 'GoLobitos Emergency' : 'Emergencia GoLobitos'}
        </h1>
      </div>

      {/* Emergency Details Form */}
      <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg max-w-lg w-full mt-4 mx-auto m-0 box-border">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {language === 'en' ? 'Emergency Booking Details' : 'Detalles de Reserva de Emergencia'}
        </h2>
        
        {/* Medical Type */}
        <label className="block mb-3">
          <span className="text-lg font-medium">
            {language === 'en' ? 'Emergency Type' : 'Tipo de Emergencia'}
          </span>
          <select className="w-full mt-2 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none">
            <option>
              {language === 'en' ? 'Medical - Critical' : 'Médico - Crítico'}
            </option>
            <option>
              {language === 'en' ? 'Medical - Non-Critical' : 'Médico - No Crítico'}
            </option>
            <option>
              {language === 'en' ? 'Fire Emergency' : 'Emergencia de Incendio'}
            </option>
            <option>
              {language === 'en' ? 'Police Assistance' : 'Asistencia Policial'}
            </option>
            <option>
              {language === 'en' ? 'Natural Disaster' : 'Desastre Natural'}
            </option>
          </select>
        </label>

        {/* Preferred Vehicle */}
        <label className="block mb-6">
          <span className="text-lg font-medium">
            {language === 'en' ? 'Preferred Vehicle' : 'Vehículo Preferido'}
          </span>
          <select className="w-full mt-2 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none">
            <option>{language === 'en' ? 'Ambulance' : 'Ambulancia'}</option>
            <option>{language === 'en' ? 'Rescue Truck' : 'Camión de Rescate'}</option>
            <option>{language === 'en' ? 'Police Car' : 'Coche de Policía'}</option>
            <option>{language === 'en' ? 'Fire Engine' : 'Camión de Bomberos'}</option>
          </select>
        </label>

        {/* On Behalf Of */}
        <label className="block mb-6">
          <span className="text-lg font-medium">
            {language === 'en' ? 'On Behalf Of (Username/Email)' : 'En Nombre De (Usuario/Correo Electrónico)'}
          </span>
          <input 
            type="text" 
            className="w-full mt-2 p-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none"
            value={onBehalfOf}
            onChange={(e) => setOnBehalfOf(e.target.value)}
            placeholder={language === 'en' ? 'Enter username or email' : 'Ingrese usuario o correo electrónico'}
          />
        </label>

        {/* Alert Driver Button */}
        <button
          onClick={handleAlertDriver}
          className="w-full bg-red-500 text-white text-lg py-3 rounded-lg hover:bg-red-600 transition-all"
        >
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          {language === 'en' ? 'Alert Driver' : 'Alertar Conductor'}
        </button>
      </div>

      {/* Live Status Update */}
      <div className="w-full max-w-lg mt-8 mx-auto m-0 p-0 box-border">
        <h2 className="text-xl font-semibold text-center mb-4">
          {language === 'en' ? 'Live Status' : 'Estado en Vivo'}
        </h2>
        <div className="bg-white text-[#027f86] p-6 rounded-lg shadow-lg flex items-center justify-center space-x-4">
          {status === 'Awaiting Driver' && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-yellow-500 text-2xl" />
              <span className="text-lg font-medium">
                {language === 'en' ? 'Awaiting Driver...' : 'Esperando al Conductor...'}
              </span>
            </div>
          )}
          {status === 'Driver On Route' && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCar} className="text-green-500 text-2xl" />
              <span className="text-lg font-medium">
                {language === 'en' ? 'Driver On Route' : 'Conductor en Camino'}
              </span>
            </div>
          )}
          {status === 'Complete' && (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 text-2xl" />
              <span className="text-lg font-medium">
                {language === 'en' ? 'Complete' : 'Completado'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmergencyBooking;
