"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/useIsMobile";

interface LinksTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  isProjectActive: boolean;
  isHero: boolean;
}

// Hook to detect mobile viewport
// Removed local definition in favor of shared hook

export default function LinksTrigger({
  isOpen,
  onClick,
  isProjectActive,
  isHero,
}: LinksTriggerProps) {
  const { playClick, playExit } = useSound();
  const { t } = useTranslation();
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
      <motion.button
        className={`fixed bottom-[calc(3%+18px)] right-[3%] flex items-center justify-center
                   px-4 py-2 rounded-sm font-mono text-[11px] font-bold cursor-pointer z-[500]
                   transition-colors duration-200 border-none appearance-none
                   ${isProjectActive || isHero ? "bg-white text-blue border border-blue/20" : "bg-blue text-white"}`}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        aria-label={isOpen ? t("links.close") : (isProjectActive ? t("links.stack") : t("links.where"))}
      >
        {isOpen ? t("links.close") : (isProjectActive ? t("links.stack") : t("links.where"))}
      </motion.button>
    );
  }

  // Desktop: vertical bar on right side
  return (
    <motion.button
      className={`fixed top-1/2 right-0 -translate-y-1/2 flex items-center justify-center
                 w-10 h-[120px] font-mono text-sm font-bold cursor-pointer z-[500]
                 transition-colors duration-200 border-none appearance-none
                 ${isProjectActive || isHero ? "bg-white text-blue" : "bg-blue text-white"}`}
      style={{
        writingMode: "vertical-rl",
        textOrientation: "mixed",
      }}
      whileHover={{ width: 50 }}
      onClick={handleClick}
      aria-label={isOpen ? t("links.close") : (isProjectActive ? t("links.stack") : t("links.where"))}
    >
      {isOpen ? t("links.close") : (isProjectActive ? t("links.stack") : t("links.where"))}
    </motion.button>
  );
}
