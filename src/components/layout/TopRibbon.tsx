"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useSoundContext } from "@/contexts/SoundContext";
import { PERSONAL } from "@/data/constants";

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
  const { isMuted, toggleMute } = useSoundContext();

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
        <span className="truncate max-w-[200px] md:max-w-none">{currentProject}</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleMute}
          className="opacity-70 hover:opacity-100 transition-opacity"
          aria-label={isMuted ? "Activer le son" : "Couper le son"}
        >
          {isMuted ? "MUTE" : "SFX"}
        </button>
        <span className="opacity-30">|</span>
        <span className="hidden md:inline">{PERSONAL.location}</span>
        <span className="opacity-30 hidden md:inline">|</span>
        <span>{time}</span>
      </div>
    </motion.div>
  );
}

export default memo(TopRibbon);
