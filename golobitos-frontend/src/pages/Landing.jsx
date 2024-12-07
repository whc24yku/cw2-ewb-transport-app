import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import { useLanguage } from '../context/LanguageContext';
import peopleIcon from '../assets/images/100.png';

const Landing = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();


  // Translations
  const translations = {
    en: {
      title: 'A New Way to Transport',
      description1: `GoLobitos is a community-centered app designed to make transportation accessible, affordable, and easy for everyone in Lobitos. From local rides to emergency transport, GoLobitos connects you with reliable transport options at any time, empowering the local economy, boosting sustainable tourism and fostering community growth.`,
      description2: `Discover absolute ride-booking, access to a local marketplace, and emergency support, all in one platform. Our mission is to create a positive impact by connecting people to essential services and opportunities while promoting eco-friendly travel.`,
      signupTitle: 'Get Started with GoLobitos',
      signupDescription: 'Join the community and experience hassle-free transport across Lobitos.',
      signupButton: 'Sign Up',
      footer: 'All rights reserved.',
    },
    es: {
      title: 'Una Nueva Forma de Transportarse',
      description1: `GoLobitos es una aplicación centrada en la comunidad diseñada para hacer que el transporte sea accesible, asequible y fácil para todos en Lobitos. Desde viajes locales hasta transporte de emergencia, GoLobitos te conecta con opciones de transporte confiables en cualquier momento, fortaleciendo la economía local, impulsando el turismo sostenible y fomentando el crecimiento comunitario.`,
      description2: `Descubre la reserva absoluta de viajes, acceso a un mercado local y soporte de emergencia, todo en una sola plataforma. Nuestra misión es crear un impacto positivo conectando a las personas con servicios esenciales y oportunidades, mientras promovemos viajes ecológicos.`,
      signupTitle: 'Comienza con GoLobitos',
      signupDescription: 'Únete a la comunidad y experimenta un transporte sin complicaciones por Lobitos.',
      signupButton: 'Regístrate',
      footer: 'Todos los derechos reservados.',
    },
  };

  const t = translations[language]; // Current translations

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col overflow-hidden m-0 p-0">
      <Navbar />
      <section className="flex-grow flex flex-col md:flex-row items-center justify-between w-full px-0 py-0">
        <div className="md:w-3/5 flex flex-col justify-center items-center space-y-6 text-justify px-4">
          <h2 className="text-3xl font-bold mb-4">{t.title}</h2>
          <p className="text-lg text-white leading-relaxed">{t.description1}</p>
          <p className="text-lg text-white leading-relaxed">{t.description2}</p>
          <div className="bg-white text-[#027f86] p-6 rounded-xl shadow-lg max-w-sm">
            <h3 className="text-2xl font-semibold mb-4">{t.signupTitle}</h3>
            <p className="text-gray-600 mb-4">{t.signupDescription}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#027f86] text-white px-6 py-3 w-full font-semibold rounded-lg hover:bg-teal-600 transition-all"
            >
              {t.signupButton}
            </button>
          </div>
        </div>
        <div className="md:w-2/5 flex justify-right items-center relative flex-row-reverse p-0">
          <img
            src={peopleIcon}
            alt="People Icon"
            className="absolute -left-6 -bottom- w-30 h-30"
            style={{ transform: 'translateX(80px)' }}
          />
        </div>
      </section>
      <footer className="bg-gray-800 text-gray-400 text-center p-6 mt-0">
        <p>&copy; 2023 GoLobitos. {t.footer}</p>
      </footer>
    </div>
  );
};

export default Landing;
