'use client';

import React, { createContext, useState, ReactNode } from 'react';

export const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
}>({
  language: 'eng',
  setLanguage: () => {}, 
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('eng');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};