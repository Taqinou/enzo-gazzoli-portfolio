"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedMuted = localStorage.getItem("soundMuted");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (savedMuted === "true" || prefersReducedMotion) {
      setIsMuted(true);
    }
    setIsHydrated(true);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("soundMuted", String(newValue));
      // Dispatch custom event to notify useSound hook
      window.dispatchEvent(new Event("soundMuteChanged"));
      return newValue;
    });
  }, []);

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext(): SoundContextType {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}
