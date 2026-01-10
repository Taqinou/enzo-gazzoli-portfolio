"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import Image from "next/image";
import { SmileyContent } from "./SmileyContent";

interface EllipsePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EllipsePanel({ isOpen, onClose }: EllipsePanelProps) {
  const { playExit } = useSound();
  const [imageError, setImageError] = useState(false);

  const handleClose = () => {
    playExit();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-[5vh] -left-[15vw] -rotate-6 w-[105vw] h-[90vh]
                     bg-white text-ink rounded-sm z-[9000]
                     py-[10vh] px-[10vw] pl-[20vw]
                     shadow-[40px_40px_0px_var(--blue)] border border-ink
                     overflow-hidden"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >


          {/* Content Grid */}
          <div
            className="w-full h-full grid gap-y-10 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] relative"
          >
            {/* Left Column: Text Info */}
            <div className="flex flex-col justify-center">
              {/* Name */}
              <motion.div
                className="font-mono text-[clamp(4rem,10vw,9rem)] font-black uppercase tracking-[-0.05em]"
                style={{ lineHeight: 0.75 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Enzo
                <br />
                Gazzoli
              </motion.div>

              {/* Role */}
              <motion.div
                className="font-serif text-[clamp(1.5rem,4vw,3.5rem)] uppercase text-blue mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                DEVELOPPEUR FULLSTACK
              </motion.div>

              {/* Contact */}
              <motion.div
                className="font-serif text-[clamp(1.2rem,2.5vw,2rem)] italic mt-8 select-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href="mailto:enzo.gazzoli@icloud.com"
                  className="text-ink underline underline-offset-4 hover:opacity-70 transition-opacity select-text"
                >
                  ENZO.GAZZOLI@ICLOUD.COM
                </a>
              </motion.div>
            </div>

            {/* Right Column: Visual Block */}
            <div className="flex flex-col justify-center">
              {/* Photo Container */}
              <motion.div
                className="w-full max-w-[450px] aspect-square relative rotate-2 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {!imageError ? (
                  <Image
                    src="/images/placeholder.jpg"
                    alt="Enzo Gazzoli"
                    fill
                    className="object-cover grayscale contrast-150 brightness-90"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-ink/10 flex items-center justify-center">
                    <span className="font-mono text-ink/30 text-sm uppercase">Photo</span>
                  </div>
                )}
              </motion.div>

              {/* Caption Block (Loc + Smiley) */}
              <motion.div
                className="mt-10 flex items-start justify-between max-w-[450px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="font-mono text-[13px] uppercase tracking-[0.2em] leading-relaxed pt-2">
                  Nancy (FR)
                  <br />
                  Worldwide
                </div>

                {/* Smiley Button as a Signature */}
                <div
                  className="font-mono text-[clamp(3rem,6vw,5rem)] cursor-pointer text-blue leading-none"
                  style={{
                    transform: "rotate(90deg) translateX(-10%)",
                    transformOrigin: "center center",
                  }}
                  onClick={handleClose}
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
