"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { translations, TranslationKey } from "./translations";
import { LanguageCode } from "./languages";

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: TranslationKey, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("EN");
  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("ikodio_language");
    if (savedLanguage && translations[savedLanguage as LanguageCode]) {
      setLanguageState(savedLanguage as LanguageCode);
    }

    // Listen for language change events
    const handleLanguageChange = () => {
      forceUpdate({});
    };
    window.addEventListener("languageChange", handleLanguageChange);

    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("ikodio_language", lang);
    // Trigger re-render of all components
    window.dispatchEvent(new Event("languageChange"));
  };

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    const langTranslations = translations[language] || {};
    let text = langTranslations[key] || translations.EN[key] || key;

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{{${param}}}`, value);
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
