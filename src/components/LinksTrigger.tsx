"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface LinksTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  isProjectActive: boolean;
  isHero: boolean;
}

// Hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default function LinksTrigger({
  isOpen,
  onClick,
  isProjectActive,
  isHero,
}: LinksTriggerProps) {
  const { playClick, playExit } = useSound();
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (isOpen) {
      playExit();
    } else {
      playClick();
    }
    onClick();
  };

  // Mobile: bottom right corner, aligned with IdentityCircle
  // Desktop: middle right, vertical
  if (isMobile) {
    return (
      <motion.div
        className={`fixed bottom-[calc(3%+18px)] right-[3%] flex items-center justify-center
                   px-4 py-2 rounded-sm font-mono text-[11px] font-bold cursor-pointer z-[500]
                   transition-colors duration-200
                   ${isProjectActive || isHero ? "bg-white text-blue border border-blue/20" : "bg-blue text-white"}`}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
      >
        {isOpen ? "FERMER" : (isProjectActive ? "STACK" : "OU?")}
      </motion.div>
    );
  }

  // Desktop: vertical bar on right side
  return (
    <motion.div
      className={`fixed top-1/2 right-0 -translate-y-1/2 flex items-center justify-center
                 w-10 h-[120px] font-mono text-sm font-bold cursor-pointer z-[500]
                 transition-colors duration-200
                 ${isProjectActive || isHero ? "bg-white text-blue" : "bg-blue text-white"}`}
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}
      whileHover={{ width: 50 }}
      onClick={handleClick}
    >
      {isOpen ? "FERMER" : (isProjectActive ? "STACK" : "OU?")}
    </motion.div>
  );
}
