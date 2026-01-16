"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { NAV_LINKS } from "@/data/constants";

interface LinksOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LinksOverlay({ isOpen, onClose }: LinksOverlayProps) {
  const { playExit } = useSound();
  const { t } = useTranslation();

  const handleClose = () => {
    playExit();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white z-[20000] overflow-y-auto px-4 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <div className="min-h-full w-full flex flex-col items-center justify-center py-12 gap-1 md:gap-2.5">
            {NAV_LINKS.map((link, i) => {
              const target = "target" in link ? link.target : undefined;
              return (
                <motion.a
                  key={link.labelKey}
                  href={link.href}
                  target={target}
                  rel={target === "_blank" ? "noopener noreferrer" : undefined}
                  className="font-mono text-[clamp(1.8rem,7vw,3rem)] md:text-[clamp(2.5rem,5.5vw,5rem)] font-black uppercase text-ink
                            no-underline transition-colors duration-100 tracking-[-0.08em] text-center
                            hover:text-blue select-text w-fit break-words max-w-[90vw]"
                  style={{ lineHeight: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={t(link.labelKey)}
                >
                  {t(link.labelKey)}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
