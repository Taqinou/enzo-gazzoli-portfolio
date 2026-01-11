"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface TopRibbonProps {
  isVisible: boolean;
  currentProject: string;
  isProjectActive: boolean;
}

function TopRibbon({
  isVisible,
  currentProject,
  isProjectActive,
}: TopRibbonProps) {
  const [time, setTime] = useState("00:00");
  const lastMinuteRef = useRef(-1);
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const currentMinute = now.getMinutes();

      // Only update if minute changed
      if (currentMinute !== lastMinuteRef.current) {
        lastMinuteRef.current = currentMinute;
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(currentMinute).padStart(2, "0");
        setTime(`${h}:${m}`);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "fr" : "en");
  }, [locale, setLocale]);

  if (isProjectActive) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-10 md:h-6 bg-blue text-white
                 flex justify-between items-center px-4 md:px-5
                 font-mono text-[11px] md:text-[9px] font-bold tracking-[0.1em] uppercase z-[9999]"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden md:inline">ENZO GAZZOLI</span>
        <span className="md:hidden">E.G</span>
        <span className="opacity-30">|</span>
        <span className="truncate max-w-[120px] md:max-w-none">{currentProject}</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden md:inline">NANCY (FR)</span>
        <span className="opacity-30 hidden md:inline">|</span>
        <span>{time}</span>
        <span className="opacity-30">|</span>
        <button
          onClick={toggleLocale}
          className="flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Toggle language"
        >
          <span className={locale === "fr" ? "opacity-100" : "opacity-40"}>FR</span>
          <span className="opacity-40">/</span>
          <span className={locale === "en" ? "opacity-100" : "opacity-40"}>EN</span>
        </button>
      </div>
    </motion.div>
  );
}

export default memo(TopRibbon);
