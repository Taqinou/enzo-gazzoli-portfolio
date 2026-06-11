"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type Theme = "default" | "minimal";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("theme-minimal", theme === "minimal");
}

// La classe .theme-minimal est posée sur <html> AVANT le premier paint par le
// script inline de layout.tsx : on initialise donc le state de façon synchrone
// depuis le DOM (et non depuis localStorage dans un useEffect post-mount, ce
// qui garantissait un FOUC du thème artistique + IntroOverlay).
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "default";
  return document.documentElement.classList.contains("theme-minimal")
    ? "minimal"
    : "default";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Marqueur post-hydratation : tant qu'il est absent, le CSS masque l'arbre
  // du thème par défaut rendu par le serveur pour les visiteurs "minimal"
  // (voir globals.css), sans impacter les transitions de toggle ensuite.
  useEffect(() => {
    document.documentElement.classList.add("theme-hydrated");
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // ignore
    }
    applyThemeClass(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "default" ? "minimal" : "default";
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
      applyThemeClass(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
