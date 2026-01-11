"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Simple hook to access translations.
 * This is a convenience wrapper around useLanguage.
 *
 * Usage:
 * const { t, locale, setLocale } = useTranslation();
 * <span>{t("hero.archive")}</span>
 */
export function useTranslation() {
  return useLanguage();
}
