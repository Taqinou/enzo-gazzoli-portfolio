"use client";

import { memo } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";

interface ThemeToggleProps {
  visible?: boolean;
}

const ThemeToggle = memo(({ visible = true }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  if (!visible) return null;

  const isMinimal = theme === "minimal";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isMinimal ? t("themeToggle.toDefaultAriaLabel") : t("themeToggle.toMinimalAriaLabel")}
      className={`fixed top-12 right-4 md:top-10 md:right-5 z-[9998] flex h-8 items-center rounded-full border px-3
                 font-mono text-[0.625rem] font-bold uppercase tracking-[0.15em]
                 transition-colors duration-300 ease-out-expo
                 ${isMinimal
                   ? "border-mn-border bg-white/80 text-mn-foreground backdrop-blur-md hover:bg-mn-muted"
                   : "border-white/30 bg-blue text-white hover:bg-white hover:text-blue"}`}
    >
      {isMinimal ? t("themeToggle.toDefaultLabel") : t("themeToggle.toMinimalLabel")}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
