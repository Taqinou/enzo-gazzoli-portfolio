"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { archiveItems } from "@/data/projects";

interface HeroSectionProps {
  isActive: boolean;
  onScrollToProject: (index: number) => void;
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

export default function HeroSection({
  isActive,
  onScrollToProject,
}: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { playClick, playExit } = useSound();
  const lastSoundTime = useRef(0);
  const isMobile = useIsMobile();

  const toggleArchive = () => {
    const now = Date.now();
    if (now - lastSoundTime.current < 100) return;
    lastSoundTime.current = now;

    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      playClick();
    } else {
      playExit();
    }
  };

  const handleCvClick = useCallback(() => {
    const now = Date.now();
    if (now - lastSoundTime.current < 100) return;
    lastSoundTime.current = now;
    playClick();
  }, [playClick]);

  const handleProjectClick = (index: number) => {
    const now = Date.now();
    if (now - lastSoundTime.current < 100) return;
    lastSoundTime.current = now;
    playClick();

    setIsOpen(false);
    onScrollToProject(index);
  };

  // Stagger margins for archive items (scattered chaos effect)
  const marginLefts = ["0vw", "10vw", "3vw", "15vw", "6vw", "18vw"];

  return (
    <section
      className="h-screen w-full snap-section bg-blue overflow-hidden
                 grid items-stretch justify-stretch box-border relative
                 transition-colors duration-[600ms] ease-out-expo
                 px-4 py-6 md:px-[60px] md:py-[40px]"
      style={{
        gridTemplateColumns: "clamp(60px, 12vw, 200px) 1fr",
        gridTemplateRows: "1fr 80px md:1fr md:120px",
      }}
    >
      {/* Sidebar - ARCHIVE on left */}
      <div className="row-span-2 overflow-visible flex items-center justify-start pl-3 md:pl-5 relative">
        {/* Archive Button */}
        <motion.h2
          className="font-serif text-[20vw] md:text-[clamp(2.5rem,12vw,15rem)] uppercase text-white cursor-pointer z-20 tracking-[-0.05em] hover:text-ink origin-left"
          style={{ lineHeight: 0.8 }}
          animate={{
            scale: isOpen ? 0.4 : 1,
            opacity: isOpen ? 0.3 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={toggleArchive}
        >
          ARCHIVE
        </motion.h2>
      </div>

      {/* Archive List - Mobile: fullscreen overlay / Desktop: inline */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${isMobile
              ? "fixed inset-0 z-[100] bg-blue flex flex-col justify-center items-start px-8 py-20"
              : "col-start-2 row-span-2 flex flex-col justify-between items-start pl-[10vw] relative"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Mobile: ARCHIVE button to close */}
            {isMobile && (
              <motion.h2
                className="absolute top-28 left-8 font-serif text-[15vw] uppercase text-white/40 cursor-pointer tracking-[-0.05em] hover:text-white"
                style={{ lineHeight: 0.8 }}
                onClick={toggleArchive}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ARCHIVE
              </motion.h2>
            )}

            {archiveItems.map((item, i) => (
              <motion.div
                key={item.index}
                className={`font-serif lowercase text-white cursor-pointer w-fit tracking-[-0.02em] hover:text-ink hover:bg-white hover:px-2.5
                           ${isMobile ? "text-[clamp(1.8rem,8vw,3.5rem)] my-4" : "text-[clamp(2rem,5vw,6rem)] my-2.5"}`}
                style={{
                  fontWeight: 400,
                  lineHeight: 1,
                  marginLeft: isMobile ? 0 : (marginLefts[i] || "0vw"),
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                onPointerDown={() => handleProjectClick(item.index)}
              >
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CV Link */}
      <div className="absolute top-[60px] md:top-[120px] right-4 md:right-10 z-20 pointer-events-auto">
        <Link
          href="/cv"
          onPointerDown={handleCvClick}
          className="font-serif text-[8.5vw] md:text-[clamp(1.4rem,5vw,3.5rem)] lowercase italic text-white/70 hover:text-white transition-colors duration-300"
        >
          curriculum vitae.
        </Link>
      </div>

      {/* Footer - Year */}
      <div
        className="absolute bottom-4 md:bottom-10 right-4 md:right-10 font-mono text-[clamp(3rem,20vw,22rem)] text-white opacity-10 font-black whitespace-nowrap pointer-events-none"
        style={{ lineHeight: 0.8, letterSpacing: "-0.05em" }}
      >
        {new Date().getFullYear()}
      </div>
    </section>
  );
}
