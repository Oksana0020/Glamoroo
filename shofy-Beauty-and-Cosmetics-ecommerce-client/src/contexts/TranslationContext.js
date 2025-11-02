import React, { createContext, useContext, useState, useEffect } from 'react';
import { TranslationService } from '../factories/LanguageFactory';

// Create Translation Context
const TranslationContext = createContext();

// Translation Provider Component
export const TranslationProvider = ({ children, defaultLanguage = 'en' }) => {
  const [translationService, setTranslationService] = useState(
    new TranslationService(defaultLanguage)
  );
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage);

  // Change language function
  const changeLanguage = (languageCode) => {
    translationService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    // Save to localStorage
    localStorage.setItem('shofy_language', languageCode);
  };

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('shofy_language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
      changeLanguage(savedLanguage);
    }
  }, []);

  const value = {
    t: (key, params) => translationService.t(key, params),
    currentLanguage,
    changeLanguage,
    supportedLanguages: translationService.getSupportedLanguages()
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Higher-order component for class components
export const withTranslation = (Component) => {
  return (props) => {
    const translation = useTranslation();
    return <Component {...props} {...translation} />;
  };
};