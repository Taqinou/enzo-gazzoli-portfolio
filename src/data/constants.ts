// Personal information
export const PERSONAL = {
  name: "Enzo Gazzoli",
  email: "enzo.gazzoli@icloud.com",
  location: "NANCY (FR)",
} as const;

// Social links
export const SOCIAL_LINKS = {
  github: "https://github.com/Taqinou",
  linkedin: "https://www.linkedin.com/in/enzo-gazzoli",
  fiverr: "https://www.fiverr.com/s/Q7Pyl31",
  malt: "https://www.malt.fr/profile/enzogazzoli",
} as const;

// Site configuration
export const SITE_CONFIG = {
  url: "https://enzo-gazzoli.com",
  title: "enzo gazzoli.",
} as const;

// Navigation links for overlay
export const NAV_LINKS = [
  { label: "CV", href: "/cv" },
  { label: "EMAIL", href: `mailto:${PERSONAL.email}` },
  { label: "GITHUB", href: SOCIAL_LINKS.github, target: "_blank" as const },
  { label: "LINKEDIN", href: SOCIAL_LINKS.linkedin, target: "_blank" as const },
  { label: "FIVERR", href: SOCIAL_LINKS.fiverr, target: "_blank" as const },
  { label: "MALT", href: SOCIAL_LINKS.malt, target: "_blank" as const },
] as const;

// Animation timing constants
export const ANIMATION = {
  /** Minimum time between sound effects (ms) */
  throttleLimit: 100,
  /** Intersection observer threshold (0-1) */
  intersectionThreshold: 0.5,
  /** Identity circle rotation duration (seconds) */
  identityCircleRotationDuration: 12,
  /** Velocity reset delay (ms) */
  velocityResetDelay: 100,
} as const;

/**
 * Responsive breakpoints (matching Tailwind CSS defaults)
 *
 * Usage:
 * - sm (640px):  Small devices like phones in landscape
 * - md (768px):  Tablets and larger phones
 * - lg (1024px): Laptops and small desktops
 * - xl (1280px): Desktops
 * - 2xl (1536px): Large desktops
 *
 * These values match Tailwind's default breakpoints.
 * Use these constants for JavaScript-based media queries to stay consistent.
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
