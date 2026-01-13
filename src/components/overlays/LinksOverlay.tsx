"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { NAV_LINKS } from "@/data/constants";

interface LinksOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinksOverlay({ isOpen, onClose }: LinksOverlayProps) {
  const { playExit } = useSound();

  const handleClose = () => {
    playExit();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white z-[20000] flex flex-col items-center justify-center px-4 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <div className="flex flex-col items-center gap-1 md:gap-2.5">
            {NAV_LINKS.map((link, i) => {
              const target = "target" in link ? link.target : undefined;
              return (
              <motion.a
                key={link.label}
                href={link.href}
                target={target}
                rel={target === "_blank" ? "noopener noreferrer" : undefined}
                className="font-mono text-[clamp(2rem,8vw,4rem)] md:text-[clamp(3rem,10vw,8rem)] font-black uppercase text-ink
                          no-underline transition-colors duration-100 tracking-[-0.08em] text-center
                          hover:text-blue select-text w-full break-words max-w-[90vw]"
                style={{ lineHeight: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => e.stopPropagation()}
              >
                {link.label}
              </motion.a>
            );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
