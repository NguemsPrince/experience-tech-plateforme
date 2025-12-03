import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSelector = ({ className = '' }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    
    // Sauvegarder la préférence
    localStorage.setItem('preferred-language', languageCode);
  };

  const isRTL = i18n.language === 'ar';

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-1.5 px-2 py-1.5 text-xs font-medium text-gray-700 
          bg-white border border-gray-300 rounded-md hover:bg-gray-50 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors duration-200
          ${isRTL ? 'space-x-reverse' : ''}
        `}
        aria-label={t('language.switch_language')}
      >
        <GlobeAltIcon className="h-3.5 w-3.5" />
        <span className="text-sm">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <ChevronDownIcon 
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu déroulant */}
          <div className={`
            absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg
            ${isRTL ? 'left-0' : 'right-0'}
          `}>
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`
                    w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                    transition-colors duration-150
                    ${isRTL ? 'space-x-reverse' : 'space-x-3'}
                    ${i18n.language === language.code ? 'bg-blue-50 text-blue-700' : ''}
                  `}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className={isRTL ? 'text-right' : 'text-left'}>
                    {language.name}
                  </span>
                  {i18n.language === language.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;