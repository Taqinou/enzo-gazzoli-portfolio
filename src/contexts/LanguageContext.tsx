"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import en from "@/data/translations/en.json";
import fr from "@/data/translations/fr.json";

export type Locale = "en" | "fr";

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Translations> = { en, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Return key if translation not found
    }
  }

  return typeof current === "string" ? current : path;
}

function detectBrowserLanguage(): Locale {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("fr") ? "fr" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check localStorage first, then browser language
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (savedLocale && (savedLocale === "en" || savedLocale === "fr")) {
      setLocaleState(savedLocale);
    } else {
      setLocaleState(detectBrowserLanguage());
    }
    setIsHydrated(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    // Update html lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(translations[locale], key);
    },
    [locale]
  );

  // Prevent hydration mismatch by not rendering until locale is determined
  if (!isHydrated) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
