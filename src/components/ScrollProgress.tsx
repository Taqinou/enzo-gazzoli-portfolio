"use client";

import { memo } from "react";
import { motion } from "framer-motion";

interface ScrollProgressProps {
  progress: number;
  isVisible: boolean;
  isHero: boolean;
  isProjectActive: boolean;
}

function ScrollProgress({
  progress,
  isVisible,
  isHero,
  isProjectActive,
}: ScrollProgressProps) {
  return (
    <motion.div
      className="fixed left-4 md:left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 md:gap-5 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible && !isProjectActive ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Label */}
      <div
        className={`font-mono text-[9px] md:text-[10px] tracking-[0.2em] transition-colors duration-[400ms]
                   ${isHero ? "text-white opacity-80" : "text-blue opacity-50"}`}
        style={{ writingMode: "vertical-rl" }}
      >
        SCROLL
      </div>

      {/* Progress Bar Container */}
      <div
        className={`w-px h-[80px] md:h-[100px] relative transition-colors duration-[400ms]
                   ${isHero ? "bg-white/20" : "bg-black/10"}`}
      >
        {/* Progress Bar Fill */}
        <motion.div
          className={`absolute top-0 left-0 w-full transition-colors duration-[400ms]
                     ${isHero ? "bg-white" : "bg-blue"}`}
          animate={{ height: `${Math.max(5, progress)}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
} export default memo(ScrollProgress);
