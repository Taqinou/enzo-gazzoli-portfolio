"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, TrendingUp, Palette, Wrench, Info } from "lucide-react";
import { OptionCategory as OptionCategoryType, getOptionsByCategory, categoryMeta } from "@/data/pricing";
import { useSound } from "@/hooks/useSound";
import { useLanguage } from "@/contexts/LanguageContext";

interface OptionCategoryProps {
  category: OptionCategoryType;
  isOptionSelected: (id: string) => boolean;
  isOptionIncluded: (id: string) => boolean;
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}

const OptionCategory = memo(function OptionCategory({
  category,
  isOptionSelected,
  isOptionIncluded,
  onToggle,
  defaultOpen = false,
}: OptionCategoryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null);
  const { playClick } = useSound();
  const { locale } = useLanguage();
  
  const meta = categoryMeta[category];
  const options = getOptionsByCategory(category);
  const isFr = locale === "fr";

  const Icon = {
    Code2,
    TrendingUp,
    Palette,
    Wrench,
  }[meta.icon as "Code2" | "TrendingUp" | "Palette" | "Wrench"];

  const handleToggleAccordion = () => {
    playClick();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (id: string) => {
    if (isOptionIncluded(id)) return;
    playClick();
    onToggle(id);
  };

  const handleInfoClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playClick();
    setExpandedInfo(expandedInfo === id ? null : id);
  };

  return (
    <div className="border-b border-ink/10">
      <motion.button
        onClick={handleToggleAccordion}
        className="w-full flex items-center justify-between py-4 text-left"
        whileTap={{ scale: 0.995 }}
      >
        <span className="flex items-center gap-3">
          <span className="text-lg text-ink/60">
            {Icon && <Icon size={20} strokeWidth={1.5} />}
          </span>
          <span className="font-mono text-sm uppercase tracking-wider font-bold text-ink">
            {isFr ? meta.label : meta.labelEn}
          </span>
        </span>
        <motion.span
          className="font-mono text-xl text-ink/40"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          +
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 flex flex-col gap-2">
              {options.map((option, i) => {
                const isIncluded = isOptionIncluded(option.id);
                const isSelected = isOptionSelected(option.id);
                const isInfoOpen = expandedInfo === option.id;

                return (
                  <div key={option.id} className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleOptionClick(option.id)}
                        disabled={isIncluded}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                        className={`
                          flex-1 flex items-center justify-between py-3 px-4 text-left
                          transition-colors duration-200 rounded-md
                          ${isIncluded
                            ? "bg-ink/5 opacity-60 cursor-default"
                            : isSelected
                            ? "bg-blue/10 border-l-2 border-blue"
                            : "hover:bg-ink/5"
                          }
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`
                              w-4 h-4 border flex items-center justify-center rounded-sm
                              transition-colors duration-200
                              ${isSelected ? "border-blue bg-blue" : "border-ink/30"}
                            `}
                          >
                            {isSelected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-white text-[10px]"
                              >
                                ✓
                              </motion.span>
                            )}
                          </span>
                          <span className="font-serif text-base md:text-lg text-ink">
                            {isFr ? option.name : option.nameEn}
                          </span>
                        </span>
                        
                        <span className="flex items-center gap-3">
                          {isIncluded ? (
                            <span className="font-mono text-xs uppercase tracking-wider text-green-600">
                              {isFr ? "Inclus" : "Included"}
                            </span>
                          ) : (
                            <span className="font-mono text-sm text-blue font-bold">
                              +{option.price}€
                            </span>
                          )}
                        </span>
                      </motion.button>

                      <button
                        onClick={(e) => handleInfoClick(e, option.id)}
                        className={`
                          p-2 text-ink/30 hover:text-blue transition-colors
                          ${isInfoOpen ? "text-blue" : ""}
                        `}
                        aria-label="Info"
                      >
                        <Info size={18} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {isInfoOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden px-4 md:px-12"
                        >
                          <div className="py-2 pb-4 text-sm font-mono text-ink/60 leading-relaxed border-l-2 border-ink/10 pl-4 ml-1">
                            {isFr ? option.description : option.descriptionEn}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

OptionCategory.displayName = "OptionCategory";

export default OptionCategory;
