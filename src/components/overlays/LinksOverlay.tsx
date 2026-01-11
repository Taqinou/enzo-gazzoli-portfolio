"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface LinksOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  { label: "CV", href: "/cv" },
  { label: "EMAIL", href: "mailto:enzo.gazzoli@icloud.com" },
  { label: "GITHUB", href: "https://github.com/Taqinou", target: "_blank" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/enzo-gazzoli", target: "_blank" },
  { label: "FIVERR", href: "https://www.fiverr.com/taqiin_/build-a-professional-website-for-your-business?utm_campaign=gigs_show&utm_medium=shared&utm_source=copy_link&utm_term=yvgdx95", target: "_blank" },
];

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
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.target}
                rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
                className="font-mono text-[clamp(2.5rem,12vw,22rem)] md:text-[clamp(4rem,15vw,22rem)] font-black uppercase text-ink
                          no-underline transition-colors duration-100 tracking-[-0.08em] text-center
                          hover:text-blue select-text"
                style={{ lineHeight: 0.75 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => e.stopPropagation()}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
