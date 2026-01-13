"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import { SmileyContent } from "@/components/ui/SmileyContent";
import { PERSONAL } from "@/data/constants";

interface EllipsePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EllipsePanel({ isOpen, onClose }: EllipsePanelProps) {
  const { playExit, playGlitch } = useSound();
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [isSmileyHovered, setIsSmileyHovered] = useState(false);

  const handleClose = () => {
    playExit();
    onClose();
  };

  // Helper to censor text
  const getCensoredText = (text: string) => {
    if (!isSmileyHovered) return text;
    return text.replace(/[^\s]/g, "?");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-[3vh] md:top-[5vh] -left-[12vw] md:-left-[15vw] -rotate-3 md:-rotate-6
                     w-[110vw] md:w-[105vw] h-[94vh] md:h-[90vh]
                     bg-white text-ink rounded-sm z-[10000]
                     py-6 px-6 pl-[18vw] md:py-[10vh] md:px-[10vw] md:pl-[20vw]
                     shadow-[20px_20px_0px_var(--blue)] md:shadow-[40px_40px_0px_var(--blue)]
                     border border-ink overflow-y-auto md:overflow-visible"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Content Grid */}
          <div className="w-full h-full grid gap-y-6 md:gap-y-10 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] relative">
            {/* Left Column: Text Info */}
            <div className="flex flex-col justify-center">
              {/* Name */}
              <motion.div
                className="font-mono text-[clamp(2.8rem,12vw,9rem)] font-black uppercase tracking-[-0.05em]"
                style={{ lineHeight: 0.75 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {getCensoredText("Enzo")}
                <br />
                {getCensoredText("Gazzoli")}
              </motion.div>

              {/* Role */}
              <motion.div
                className="font-serif text-[clamp(1.2rem,5vw,3.5rem)] uppercase text-blue mt-3 md:mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {getCensoredText(t("ellipse.title"))}
              </motion.div>

              {/* Contact */}
              <motion.div
                className="font-serif text-[clamp(1rem,3vw,2rem)] italic mt-4 md:mt-8 select-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={`mailto:${PERSONAL.email}`}
                  className="text-ink underline underline-offset-4 hover:opacity-70 transition-opacity select-text break-all"
                >
                  {getCensoredText(PERSONAL.email.toUpperCase())}
                </a>
              </motion.div>
            </div>

            {/* Right Column: Visual Block */}
            <div className="flex flex-col justify-center">
              {/* Photo Container */}
              <motion.div
                className="w-full max-w-[200px] md:max-w-[420px] aspect-square relative bg-white"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {!imageError ? (
                  <>
                    {/* Normal Image (Always rendered, below) */}
                    <Image
                      src="/images/profile-picture.jpg"
                      alt="Enzo Gazzoli"
                      fill
                      sizes="(max-width: 768px) 200px, 420px"
                      className="object-cover object-center z-10"
                      priority
                      onError={() => setImageError(true)}
                    />
                    
                    {/* Censored Image (Overlay, toggled by opacity + Scale effect) */}
                    <div 
                      className={`absolute inset-0 z-20 transition-none origin-center
                                 ${isSmileyHovered ? 'opacity-100 scale-[1.7] -rotate-6 shadow-2xl' : 'opacity-0 scale-100 rotate-0 shadow-none'}`}
                    >
                      <Image
                        src="/images/profile-picture2.jpg"
                        alt="Enzo Gazzoli Censored"
                        fill
                        sizes="(max-width: 768px) 200px, 420px"
                        className="object-cover object-center"
                        priority
                      />
                      {/* Raw Overlay Effect */}
                      <div className="absolute inset-0 bg-blue/10 mix-blend-overlay pointer-events-none"></div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-ink/10 flex items-center justify-center">
                    <span className="font-mono text-ink/30 text-sm uppercase">Photo</span>
                  </div>
                )}
              </motion.div>

              {/* Caption Block (Loc + Smiley) */}
              <motion.div
                className="mt-5 md:mt-10 flex items-center justify-between gap-8 md:gap-4 max-w-[220px] md:max-w-[450px] relative z-[100]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="font-mono text-[11px] md:text-[13px] uppercase tracking-[0.15em] md:tracking-[0.2em] leading-relaxed">
                  {getCensoredText(t("ellipse.location"))}
                  <br />
                  {getCensoredText(t("ellipse.worldwide"))}
                </div>

                {/* Smiley Button as a Signature */}
                <div
                  className="font-mono text-[clamp(3.5rem,12vw,5rem)] cursor-pointer text-blue leading-none"
                  style={{
                    transform: "rotate(90deg) translateX(-10%)",
                    transformOrigin: "center center",
                  }}
                  onClick={handleClose}
                  onMouseEnter={() => {
                    setIsSmileyHovered(true);
                    playGlitch();
                  }}
                  onMouseLeave={() => setIsSmileyHovered(false)}
                >
                  <SmileyContent />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
