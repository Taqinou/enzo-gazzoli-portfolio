"use client";

import { useRef, useState, ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Home, FolderGit2, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { PERSONAL, SOCIAL_LINKS } from "@/data/constants";

// Effet "dock macOS" : largeurs en px pilotées par la distance au curseur
const ICON_SIZE = 40;
const ICON_MAGNIFICATION = 60;
const ICON_DISTANCE = 140;
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

const LINK_CLASS =
  "flex h-full w-full items-center justify-center rounded-full text-mn-foreground transition-colors duration-300 ease-out-expo hover:bg-mn-muted";

interface DockIconProps {
  mouseX: MotionValue<number>;
  label: string;
  children: ReactNode;
}

function DockIcon({ mouseX, label, children }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return value - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(
    distance,
    [-ICON_DISTANCE, 0, ICON_DISTANCE],
    [ICON_SIZE, ICON_MAGNIFICATION, ICON_SIZE],
  );
  const width = useSpring(widthTransform, SPRING);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="relative flex aspect-square items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%" }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -top-9 left-1/2 whitespace-nowrap rounded-md bg-mn-primary px-2.5 py-1 text-xs font-medium text-mn-primary-foreground"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  );
}

export default function MinimalDock() {
  const { t } = useTranslation();
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      aria-label={t("resume.dockAriaLabel")}
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-6 left-1/2 z-[9990] flex h-[3.625rem] -translate-x-1/2 items-center gap-1 rounded-full border border-mn-border bg-white/80 px-2.5 shadow-sm backdrop-blur-md"
    >
      <DockIcon mouseX={mouseX} label={t("resume.dockHome")}>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={LINK_CLASS}
          aria-label={t("resume.dockHome")}
        >
          <Home size={18} aria-hidden="true" />
        </button>
      </DockIcon>
      <DockIcon mouseX={mouseX} label={t("resume.dockProjects")}>
        <a href="#projects" className={LINK_CLASS} aria-label={t("resume.dockProjects")}>
          <FolderGit2 size={18} aria-hidden="true" />
        </a>
      </DockIcon>
      <span className="mx-1 h-5 w-px shrink-0 bg-mn-border" aria-hidden="true" />
      <DockIcon mouseX={mouseX} label={t("resume.dockGithub")}>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
          aria-label={t("resume.dockGithub")}
        >
          <Github size={18} aria-hidden="true" />
        </a>
      </DockIcon>
      <DockIcon mouseX={mouseX} label={t("resume.dockLinkedin")}>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASS}
          aria-label={t("resume.dockLinkedin")}
        >
          <Linkedin size={18} aria-hidden="true" />
        </a>
      </DockIcon>
      <DockIcon mouseX={mouseX} label={t("resume.dockEmail")}>
        <a href={`mailto:${PERSONAL.email}`} className={LINK_CLASS} aria-label={t("resume.dockEmail")}>
          <Mail size={18} aria-hidden="true" />
        </a>
      </DockIcon>
    </nav>
  );
}
