import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const LanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const currentLangName = supportedLanguages.find(lang => lang.code === currentLanguage)?.nativeName || 'English';
  
  const handleLanguageClick = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`tp-header-top-menu-item tp-header-lang ${className}`} ref={dropdownRef} style={{ position: 'relative' }}>
      <span
        onClick={() => setIsOpen(!isOpen)}
        className="tp-header-lang-toggle tp-header-action-btn"
        style={{ cursor: 'pointer', color: 'white', fontSize: '14px' }}
      >
        {currentLangName}
      </span>
      <ul className={isOpen ? "tp-lang-list-open" : ""} style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        padding: '8px 0',
        minWidth: '120px',
        zIndex: 1000,
        display: isOpen ? 'block' : 'none'
      }}>
        {supportedLanguages.map((lang) => (
          <li key={lang.code} style={{ listStyle: 'none' }}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleLanguageClick(lang.code);
              }}
              style={{
                display: 'block',
                padding: '8px 16px',
                color: '#333',
                textDecoration: 'none',
                fontSize: '14px',
                backgroundColor: currentLanguage === lang.code ? '#f8f9fa' : 'transparent'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.target.style.backgroundColor = currentLanguage === lang.code ? '#f8f9fa' : 'transparent'}
            >
              {lang.nativeName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;