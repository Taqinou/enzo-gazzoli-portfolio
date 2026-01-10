"use client";

import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface LinksTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  isProjectActive: boolean;
  isHero: boolean;
}

export default function LinksTrigger({
  isOpen,
  onClick,
  isProjectActive,
  isHero,
}: LinksTriggerProps) {
  const { playClick, playExit } = useSound();

  const handleClick = () => {
    if (isOpen) {
      playExit();
    } else {
      playClick();
    }
    onClick();
  };

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
