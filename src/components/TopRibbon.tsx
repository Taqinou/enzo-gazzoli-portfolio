"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";

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
      className="fixed top-0 left-0 w-full h-6 bg-blue text-white
                 flex justify-between items-center px-5
                 font-mono text-[9px] font-bold tracking-[0.1em] uppercase z-[9999]"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <span>ENZO GAZZOLI</span>
        <span className="opacity-30">|</span>
        <span>{currentProject}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>NANCY (FR)</span>
        <span className="opacity-30">|</span>
        <span>{time}</span>
      </div>
    </motion.div>
  );
} export default memo(TopRibbon);
