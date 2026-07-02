"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

export type Theme = "default" | "minimal";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Le thème minimal est une feature exclusive de l'archive (/archive) : la home
// studio et les pages secondaires restent toujours en DA artistique.
function isMinimalAllowed(pathname: string): boolean {
  return pathname.startsWith("/archive");
}

// La préférence persiste dans localStorage (également lue par le script inline
// anti-FOUC de layout.tsx, qui ne pose la classe que sur /archive) : on
// initialise le state de façon synchrone depuis localStorage pour que l'archive
// s'ouvre directement dans le bon thème, sans FOUC ni flash de l'IntroOverlay.
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "default";
  try {
    return localStorage.getItem("theme") === "minimal" ? "minimal" : "default";
  } catch {
    return "default";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const pathname = usePathname();

  // Marqueur post-hydratation : tant qu'il est absent, le CSS masque l'arbre
  // du thème par défaut rendu par le serveur pour les visiteurs "minimal"
  // (voir globals.css), sans impacter les transitions de toggle ensuite.
  useEffect(() => {
    document.documentElement.classList.add("theme-hydrated");
  }, []);

  // Applique/retire la classe selon le thème ET la route : la préférence
  // "minimal" persiste entre les visites mais ne fuit jamais hors de /archive.
  useEffect(() => {
    document.documentElement.classList.toggle(
      "theme-minimal",
      theme === "minimal" && isMinimalAllowed(pathname)
    );
  }, [theme, pathname]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "default" ? "minimal" : "default";
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore
      }
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
