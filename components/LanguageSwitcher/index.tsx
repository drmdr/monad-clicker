'use client';

import { useState, useEffect } from 'react';

export type Language = 'en' | 'ja';

interface LanguageSwitcherProps {
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  useEffect(() => {
    // デフォルトは英語
    onLanguageChange('en');
  }, [onLanguageChange]);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-md p-2 flex space-x-2">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            currentLanguage === 'en'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange('ja')}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            currentLanguage === 'ja'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          日本語
        </button>
      </div>
    </div>
  );
}
