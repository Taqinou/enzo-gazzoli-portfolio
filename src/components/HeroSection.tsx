"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { archiveItems } from "@/data/projects";

interface HeroSectionProps {
  isActive: boolean;
  onScrollToProject: (index: number) => void;
}

export default function HeroSection({
  isActive,
  onScrollToProject,
}: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { playClick, playExit } = useSound();
  const lastSoundTime = useRef(0);

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
  const marginLefts = ["0vw", "15vw", "5vw", "20vw", "10vw", "25vw"];

  return (
    <section
      className="h-screen w-full snap-section bg-blue overflow-hidden
                 grid items-stretch justify-stretch box-border relative
                 transition-colors duration-[600ms] ease-out-expo"
      style={{
        gridTemplateColumns: "clamp(100px, 15vw, 200px) 1fr",
        gridTemplateRows: "1fr 120px",
        padding: "40px 60px",
      }}
    >
      {/* Sidebar Wrapper */}
      <div className="row-span-2 overflow-visible flex items-center justify-start pl-5 relative">
        {/* Archive Button */}
        <motion.h2
          className="font-serif text-[clamp(2.5rem,10vw,15rem)] uppercase text-white cursor-pointer z-20 tracking-[-0.05em] hover:text-ink origin-left"
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

      {/* Archive List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="col-start-2 row-span-2 flex flex-col justify-between items-start pl-[10vw] relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {archiveItems.map((item, i) => (
              <motion.div
                key={item.index}
                className="font-serif text-[clamp(2rem,5vw,6rem)] lowercase text-white cursor-pointer my-2.5 w-fit tracking-[-0.02em] hover:text-ink hover:bg-white hover:px-2.5"
                style={{
                  fontWeight: 400,
                  lineHeight: 0.9,
                  marginLeft: marginLefts[i] || "0vw",
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
      <div className="absolute top-[120px] right-10 z-20 pointer-events-auto">
        <Link
          href="/cv"
          onPointerDown={handleCvClick}
          className="font-serif text-[clamp(1.5rem,3vw,3.5rem)] lowercase italic text-white/70 hover:text-white transition-colors duration-300"
        >
          curriculum vitae.
        </Link>
      </div>

      {/* Footer - 2026 */}
      <div
        className="absolute bottom-10 right-10 font-mono text-[clamp(4rem,18vw,22rem)] text-white opacity-10 font-black whitespace-nowrap pointer-events-none"
        style={{ lineHeight: 0.8, letterSpacing: "-0.05em" }}
      >
        {new Date().getFullYear()}
      </div>
    </section>
  );
}
