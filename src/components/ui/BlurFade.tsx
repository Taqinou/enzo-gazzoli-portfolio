"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before the reveal starts (seconds) */
  delay?: number;
  /** Duration of the reveal (seconds) */
  duration?: number;
  /** Vertical offset applied while blurred (px) */
  yOffset?: number;
  /** Initial blur amount (px) */
  blur?: number;
  /** Reveal when scrolled into view instead of on mount */
  inView?: boolean;
  /** Render children without any animation (e.g., print variants) */
  disabled?: boolean;
}

const BlurFade = memo(
  ({
    children,
    className,
    delay = 0,
    duration = 0.8,
    yOffset = 12,
    blur = 8,
    inView = false,
    disabled = false,
  }: BlurFadeProps) => {
    const prefersReducedMotion = useReducedMotion();

    if (disabled) {
      return <div className={className}>{children}</div>;
    }

    const hidden = prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` };
    const visible = prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, filter: "blur(0px)" };

    return (
      <motion.div
        className={className}
        initial={hidden}
        {...(inView
          ? { whileInView: visible, viewport: { once: true, margin: "-50px" as const } }
          : { animate: visible })}
        transition={{ delay, duration, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.div>
    );
  }
);

BlurFade.displayName = "BlurFade";

export default BlurFade;
