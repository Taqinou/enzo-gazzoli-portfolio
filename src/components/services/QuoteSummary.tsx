"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuoteSummaryProps {
  total: number;
  duration: string;
  durationEn: string;
  onSendQuote: () => void;
}

const QuoteSummary = memo(function QuoteSummary({
  total,
  duration,
  durationEn,
  onSendQuote,
}: QuoteSummaryProps) {
  const { locale } = useLanguage();
  const isFr = locale === "fr";

  const formattedTotal = total.toLocaleString(isFr ? "fr-FR" : "en-US");

  return (
    <motion.div
      className="sticky bottom-0 left-0 right-0 bg-bg border-t border-ink/10 py-6 px-6 md:px-8 z-10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink/50">
              {isFr ? "Estimation" : "Estimate"}
            </span>
            <span className="font-serif text-3xl md:text-4xl italic text-ink">
              {isFr ? "à partir de" : "from"}{" "}
              <span className="text-blue font-bold not-italic">{formattedTotal} €</span>
            </span>
          </div>
          <span className="hidden md:block text-ink/30">|</span>
          <span className="font-mono text-xs uppercase tracking-wider text-ink/50">
            {isFr ? duration : durationEn}
          </span>
        </div>

        <motion.button
          onClick={onSendQuote}
          className="bg-blue text-white px-8 py-4 font-mono text-sm uppercase tracking-wider font-bold
                     hover:bg-ink transition-colors duration-300 whitespace-nowrap"
          whileTap={{ scale: 0.98 }}
        >
          {isFr ? "Envoyer cette simulation" : "Send this simulation"}
        </motion.button>
      </div>
    </motion.div>
  );
});

QuoteSummary.displayName = "QuoteSummary";

export default QuoteSummary;
