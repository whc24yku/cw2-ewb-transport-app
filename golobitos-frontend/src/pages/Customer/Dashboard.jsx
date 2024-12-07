import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar, faShoppingBasket, faAmbulance, faCog, faPhone, faEnvelope, faUserEdit,
  faChevronDown, faChevronUp, faWallet, faHistory, faGlobe
} from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../context/LanguageContext'; // Import the useLanguage hook

const CustomerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage(); // Destructure language and toggleLanguage function

  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState('Guest');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const dropdownRef = useRef(null);

  const translations = {
    en: {
      welcomeMessage: 'Welcome, {userName}!',
      title: 'Customer Dashboard',
      bookTransport: 'Book Transport',
      marketplace: 'Marketplace',
      medicServices: 'Medic Services',
      settings: 'Settings',
      description: 'Explore all the features and services GoLobitos has to offer.',
      aboutUs: 'About Us',
      contact: 'Contact',
      logout: 'Logout',
      creditsBalance: 'Credits Balance',
      transactionHistory: 'Transaction History',
      editProfile: 'Edit Profile',
      offlineMessage: 'You are offline. Your data will be saved locally and synced once you\'re online.',
    },
    es: {
      welcomeMessage: '¡Bienvenido, {userName}!',
      title: 'Panel de Cliente',
      bookTransport: 'Reservar Transporte',
      marketplace: 'Mercado',
      medicServices: 'Servicios Médicos',
      settings: 'Configuraciones',
      description: 'Explora todas las características y servicios que GoLobitos tiene para ofrecer.',
      aboutUs: 'Sobre Nosotros',
      contact: 'Contacto',
      logout: 'Cerrar sesión',
      creditsBalance: 'Balance de Créditos',
      transactionHistory: 'Historial de Transacciones',
      editProfile: 'Editar Perfil',
      offlineMessage: 'Estás desconectado. Tu data será guardada localmente y sincronizada cuando estés en línea.',
    },
  };

  const t = translations[language]; // Current translations

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (userDetails?.name) {
      setUserName(userDetails.name);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const saveDataOffline = (key, data) => {
    if (isOffline) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      console.log('Syncing data to the server');
    }
  };

  const loadDataOffline = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  const OfflineNotification = () => {
    if (isOffline) {
      return (
        <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-center p-2">
          {t.offlineMessage}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-hidden m-0 p-0">
      <OfflineNotification />

      <header className="flex items-center justify-between p-4 bg-[#027f86] shadow-lg">
        <div className="flex items-center ml-4">
          <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
            Go
          </div>
          <h1 className="text-lg font-semibold text-white ml-3">{t.title}</h1>
        </div>

        <nav className="flex items-center space-x-4 mr-4">
          <button onClick={() => navigate('/about')} className="text-white hover:text-yellow-300 transition-all">
            {t.aboutUs}
          </button>
          <button onClick={() => navigate('/contact')} className="text-white hover:text-yellow-300 transition-all">
            {t.contact}
          </button>

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
                  {t.creditsBalance}
                </button>
                <button className="flex items-center w-full px-4 py-2 hover:bg-yellow-300" onClick={() => setShowDropdown(false)}>
                  <FontAwesomeIcon icon={faHistory} className="mr-2" />
                  {t.transactionHistory}
                </button>
                <button onClick={() => navigate('/edit-profile')} className="flex items-center w-full px-4 py-2 hover:bg-yellow-300">
                  <FontAwesomeIcon icon={faUserEdit} className="mr-2" />
                  {t.editProfile}
                </button>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/login')} className="bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all">
            {t.logout}
          </button>

          {/* Language Switch Button */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all"
          >
            <FontAwesomeIcon icon={faGlobe} className="mr-2" />
            {language === 'en' ? 'Español' : 'English'}
          </button>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-yellow-300 text-center mb-4">
            {t.welcomeMessage.replace('{userName}', userName || 'Guest')}
          </h1>
          <p className="text-lg text-center text-white mb-6">{t.description}</p>
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
            <span className="mt-4 font-semibold">{t.bookTransport}</span>
          </div>
          <div
            onClick={() => navigate('/customer/marketplace')}
            className="flex flex-col items-center justify-center p-6 bg-green-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faShoppingBasket} size="2x" />
            <span className="mt-4 font-semibold">{t.marketplace}</span>
          </div>
          <div
            onClick={() => navigate('/customer/emergency-confirmation')}
            className="flex flex-col items-center justify-center p-6 bg-red-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faAmbulance} size="2x" />
            <span className="mt-4 font-semibold">{t.medicServices}</span>
          </div>
          <div
            onClick={() => navigate('/customer/settings')}
            className="flex flex-col items-center justify-center p-6 bg-gray-500 text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCog} size="2x" />
            <span className="mt-4 font-semibold">{t.settings}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
