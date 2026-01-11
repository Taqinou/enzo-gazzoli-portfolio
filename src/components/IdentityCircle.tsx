"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

interface IdentityCircleProps {
  onClick: () => void;
  isProjectActive: boolean;
  isHero: boolean;
  scrollVelocity: number;
  showExit: boolean;
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

export default function IdentityCircle({
  onClick,
  isProjectActive,
  isHero,
  scrollVelocity,
  showExit,
}: IdentityCircleProps) {
  const { playClick, playExit } = useSound();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const letterRadius = isMobile ? 28 : 30;

  const handleClick = () => {
    if (showExit) {
      playExit();
    } else {
      playClick();
    }
    onClick();
  };

  // Squish & stretch based on scroll velocity
  const scaleY = 1 + scrollVelocity * 0.002;
  const scaleX = 1 - scrollVelocity * 0.002;

  // Letters for the spinning wheel - more meaningful text
  const letters = showExit ? t("identity.exit").split("") : t("identity.info").split("");

  // Position for each letter (8 positions around the circle)
  const positions = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <motion.div
      className={`fixed bottom-[3%] left-[3%] md:bottom-[4%] md:left-[4%] w-[72px] h-[72px] md:w-20 md:h-20 cursor-pointer z-[1000] rounded-full
                  transition-colors duration-100
                  ${isProjectActive || isHero ? "bg-white border border-blue" : "bg-blue"}`}
      animate={{
        scaleX: Math.max(0.8, scaleX),
        scaleY: Math.min(1.2, scaleY),
      }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            className={`absolute top-1/2 left-1/2 font-mono text-sm md:text-base font-bold
                        ${isProjectActive || isHero ? "text-blue" : "text-white"}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${positions[i]}deg) translateY(-${letterRadius}px) rotate(180deg)`,
            }}
          >
            {letter}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}
