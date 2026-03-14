import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, setLanguage as setGlobalLanguage, t, Translations } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({ children, defaultLanguage = 'pt-BR' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setGlobalLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Initialize language from localStorage or default
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['pt-BR', 'en-US'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      setLanguage(defaultLanguage);
    }
  }, []);

  const contextValue = {
    language,
    setLanguage,
    t: (key: string) => t(key)
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}