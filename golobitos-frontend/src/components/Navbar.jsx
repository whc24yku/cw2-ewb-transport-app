import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { language, setLanguage } = useLanguage();

  // Translations
  const translations = {
    en: {
      home: 'Home',
      about: 'About Us',
      contact: 'Contact',
      login: 'Login',
      tripadvisorButton: 'Explore Lobitos on TripAdvisor',
      disclaimer: 'This link redirects to TripAdvisor. Content is not managed by GoLobitos.',
      languageToggle: 'Español',
    },
    es: {
      home: 'Inicio',
      about: 'Sobre Nosotros',
      contact: 'Contacto',
      login: 'Iniciar Sesión',
      tripadvisorButton: 'Explora Lobitos en TripAdvisor',
      disclaimer: 'Este enlace redirige a TripAdvisor. El contenido no es gestionado por GoLobitos.',
      languageToggle: 'English',
    },
  };

  const t = translations[language]; // Current translations

  const openTripAdvisor = () => {
    window.open(
      'https://www.tripadvisor.co.uk/Tourism-g2212223-Lobitos_Piura_Region-Vacations.html',
      '_blank'
    );
  };

  return (
    <header className="bg-[#027f86] text-white p-5 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-xl">
            Go
          </div>
          <h1 className="text-2xl font-semibold">GoLobitos</h1>
        </div>

        {/* TripAdvisor Button */}
        <div className="flex items-center flex-col">
          <button
            onClick={openTripAdvisor}
            className="bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all"
          >
            {t.tripadvisorButton}
          </button>
          <p className="text-xs text-white mt-1">{t.disclaimer}</p>
        </div>

        {/* Navigation Links + Language Toggle */}
        <nav className="flex items-center space-x-6">
          <Link
            to="/landing"
            className="text-white hover:text-yellow-300 transition-all"
          >
            {t.home}
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-yellow-300 transition-all"
          >
            {t.about}
          </Link>
          <Link
            to="/contact"
            className="text-white hover:text-yellow-300 transition-all"
          >
            {t.contact}
          </Link>
          <Link
            to="/login"
            className="bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all"
          >
            {t.login}
          </Link>
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="flex items-center bg-yellow-300 text-[#027f86] px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all"
          >
            <FontAwesomeIcon icon={faGlobe} className="mr-2" />
            {t.languageToggle}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
