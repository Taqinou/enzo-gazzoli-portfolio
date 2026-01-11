"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

interface IntroOverlayProps {
  onComplete: () => void;
}

export default function IntroOverlay({ onComplete }: IntroOverlayProps) {
  const [phase, setPhase] = useState<"menu" | "sequence" | "done">("menu");
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const { playIntroTick, playClick } = useSound();
  const { t } = useTranslation();

  const SEQUENCE = [
    "ENZO GAZZOLI",
    t("intro.developer"),
    "FULLSTACK",
  ];

  const startAnimation = useCallback(() => {
    if (phase === "menu") {
      setPhase("sequence");
    }
  }, [phase]);

  // Listen for any key press or click
  useEffect(() => {
    if (phase !== "menu") return;

    const handleInteraction = () => startAnimation();

    document.addEventListener("keydown", handleInteraction);
    document.addEventListener("click", handleInteraction);

    return () => {
      document.removeEventListener("keydown", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, [phase, startAnimation]);

  // Sequence - reveal lines one by one
  useEffect(() => {
    if (phase !== "sequence") return;

    if (visibleLines < SEQUENCE.length) {
      playIntroTick(600);

      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      // Wait a moment then exit
      const exitTimer = setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 600);

      return () => clearTimeout(exitTimer);
    }
  }, [phase, visibleLines, playIntroTick, onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] bg-blue flex items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0 }}
      >
        {/* Menu Phase */}
        {phase === "menu" && (
          <div className="text-center select-none">
            <h1 className="font-mono text-white text-[15px] font-bold tracking-widest">
              {t("intro.portfolio")}
            </h1>
          </div>
        )}

        {/* Sequence Phase - Index style */}
        {phase === "sequence" && (
          <div className="font-mono text-white text-center">
            {SEQUENCE.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className={`
                  ${i === 0 ? "text-[clamp(2rem,8vw,6rem)] font-bold" : ""}
                  ${i === 1 || i === 2 ? "text-[clamp(1rem,4vw,3rem)] text-white/80" : ""}
                  ${i === 3 ? "text-[clamp(1rem,3vw,2rem)] text-white/50 mt-4" : ""}
                  ${i === 4 ? "text-[clamp(1rem,2vw,1.5rem)] text-white/30 mt-2" : ""}
                  uppercase tracking-[0.1em]
                `}
              >
                {line}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
