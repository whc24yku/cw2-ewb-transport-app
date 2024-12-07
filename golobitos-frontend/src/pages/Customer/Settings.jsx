import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faPalette, faShieldAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const translations = {
  en: {
    settings: "Settings",
    profileInfo: "Profile Information",
    appPreferences: "App Preferences",
    darkMode: "Dark Mode",
    language: "Language",
    notificationSettings: "Notification Settings",
    transactionAlerts: "Transaction Alerts",
    emergencyUpdates: "Emergency Updates",
    privacyOptions: "Privacy Options",
    showAvailability: "Show Availability",
    shareLocation: "Share Location",
    saveSettings: "Save Settings",
  },
  es: {
    settings: "Configuración",
    profileInfo: "Información del Perfil",
    appPreferences: "Preferencias de la Aplicación",
    darkMode: "Modo Oscuro",
    language: "Idioma",
    notificationSettings: "Configuración de Notificaciones",
    transactionAlerts: "Alertas de Transacción",
    emergencyUpdates: "Actualizaciones de Emergencia",
    privacyOptions: "Opciones de Privacidad",
    showAvailability: "Mostrar Disponibilidad",
    shareLocation: "Compartir Ubicación",
    saveSettings: "Guardar Configuración",
  },
};

const CustomerSettings = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    transactionAlerts: true,
    emergencyUpdates: false,
    showAvailability: false,
    shareLocation: false,
  });

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-[#027f86] to-purple-600 text-white flex flex-col items-center overflow-hidden m-0 p-0 box-border">
      {/* Header with Logo and Language Toggle */}
      <header className="w-full max-w-3xl p-4 flex flex-col items-center m-0 box-border">
        <div className="flex items-center w-full justify-between mb-2">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-400 text-[#027f86] rounded-full flex items-center justify-center font-bold text-lg">
              Go
            </div>
            <h1 className="text-lg font-semibold text-white ml-2">GoLobitos</h1>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded ${language === "en" ? "bg-yellow-300 text-[#027f86]" : "bg-white text-gray-700"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`px-3 py-1 rounded ${language === "es" ? "bg-yellow-300 text-[#027f86]" : "bg-white text-gray-700"}`}
            >
              ES
            </button>
          </div>
        </div>

        {/* Centered "Settings" Heading */}
        <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-4">
          {t.settings}
        </h2>
      </header>

      {/* Main Content Box */}
      <div className="flex-grow w-full max-w-3xl bg-white text-[#027f86] rounded-lg shadow-lg p-4 overflow-y-auto box-border m-0 max-h-[75vh]">
        {/* Profile Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
            {t.profileInfo}
          </h2>
          <div className="space-y-3">
            <input type="text" placeholder="Full Name" className="w-full p-2 border rounded-lg focus:outline-none" />
            <input type="email" placeholder="Email Address" className="w-full p-2 border rounded-lg focus:outline-none" />
            <input type="tel" placeholder="Phone Number" className="w-full p-2 border rounded-lg focus:outline-none" />
          </div>
        </div>

        {/* App Preferences */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faPalette} className="mr-2 text-purple-500" />
            {t.appPreferences}
          </h2>
          <div className="flex items-center mb-3">
            <label className="mr-3">{t.darkMode}</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="transform scale-125 cursor-pointer"
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faBell} className="mr-2 text-purple-500" />
            {t.notificationSettings}
          </h2>
          <div className="flex items-center mb-3">
            <label className="mr-3">{t.transactionAlerts}</label>
            <input
              type="checkbox"
              checked={notifications.transactionAlerts}
              onChange={() =>
                setNotifications({ ...notifications, transactionAlerts: !notifications.transactionAlerts })
              }
              className="transform scale-125 cursor-pointer"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-3">{t.emergencyUpdates}</label>
            <input
              type="checkbox"
              checked={notifications.emergencyUpdates}
              onChange={() =>
                setNotifications({ ...notifications, emergencyUpdates: !notifications.emergencyUpdates })
              }
              className="transform scale-125 cursor-pointer"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold flex items-center mb-3">
            <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-purple-500" />
            {t.privacyOptions}
          </h2>
          <div className="flex items-center mb-3">
            <label className="mr-3">{t.showAvailability}</label>
            <input
              type="checkbox"
              checked={notifications.showAvailability}
              onChange={() =>
                setNotifications({ ...notifications, showAvailability: !notifications.showAvailability })
              }
              className="transform scale-125 cursor-pointer"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-3">{t.shareLocation}</label>
            <input
              type="checkbox"
              checked={notifications.shareLocation}
              onChange={() =>
                setNotifications({ ...notifications, shareLocation: !notifications.shareLocation })
              }
              className="transform scale-125 cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center">
          <button className="bg-yellow-300 text-[#027f86] px-5 py-2 rounded-lg hover:bg-yellow-400 transition-all inline-flex items-center">
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {t.saveSettings}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
