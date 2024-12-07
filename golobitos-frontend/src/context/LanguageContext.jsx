import React, { createContext, useState, useContext } from 'react';

// Create Context
const LanguageContext = createContext();

// Create a Provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default language

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom Hook for accessing language context
export const useLanguage = () => useContext(LanguageContext);
