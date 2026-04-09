"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuoteSimulator } from "@/hooks/useQuoteSimulator";
import { ProjectType, OptionCategory as OptionCategoryType, TJM, projects } from "@/data/pricing";
import OptionCategory from "@/components/services/OptionCategory";
import QuoteSummary from "@/components/services/QuoteSummary";

const OFFERS: ProjectType[] = ["website", "application", "shopify", "custom"];
const CATEGORIES: OptionCategoryType[] = ["tech", "marketing", "design", "support"];

export default function ServicesPage() {
  const router = useRouter();
  const { playClick, playExit } = useSound();
  const { t } = useTranslation();
  const { locale } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [quoteSummary, setQuoteSummary] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const {
    state,
    total,
    customDays,
    setCustomDays,
    toggleProjectType,
    setSubType,
    toggleOption,
    isOptionSelected,
    isOptionIncluded,
    getSubTypes,
    getCurrentSubType,
    generateSummary,
  } = useQuoteSimulator();

  const isFr = locale === "fr";
  const subTypes = getSubTypes();
  const currentSubType = getCurrentSubType();
  const isSimulatorOpen = state.projectType !== null;

  // Local string state for the days input — allows clearing to retype
  const [daysInputStr, setDaysInputStr] = useState<string>("");

  // Sync input string whenever the subtype resets (customDays → null)
  useEffect(() => {
    if (customDays === null && currentSubType) {
      setDaysInputStr(String(currentSubType.days));
    }
  }, [customDays, currentSubType?.days]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/?skipIntro=true");
    }, 80);
  };

  const handleOfferClick = (type: ProjectType) => {
    playClick();
    toggleProjectType(type);
  };

  const handleSendQuote = () => {
    playClick();
    const summary = generateSummary(locale);
    setQuoteSummary(summary);
    
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClick();
    setStatus("sending");

    try {
      const payload: { name: string; email: string; message: string; quoteSummary?: string } = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      if (quoteSummary) {
        payload.quoteSummary = quoteSummary;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setQuoteSummary(null);
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen overflow-x-hidden"
    >
      <nav className="fixed top-0 left-0 w-full flex justify-between items-baseline px-6 md:px-10 py-6 md:py-8 z-[50] pointer-events-none mix-blend-difference">
        <a
          href="/?skipIntro=true"
          onClick={handleBack}
          className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
        >
          {t("services.index")}
        </a>
      </nav>

      <section className="bg-bg text-ink min-h-screen relative">
        <main className="relative grid grid-cols-1 md:grid-cols-[clamp(60px,12vw,200px)_1fr]">
          
          <div className="hidden md:flex sticky top-0 h-screen flex-col items-center justify-center border-r border-ink/10">
            <motion.div 
              className="absolute inset-0 bg-ink/5 origin-bottom"
              style={{ scaleY: scrollYProgress }}
            />
            <h1 className="-rotate-90 whitespace-nowrap font-serif text-[12vh] text-ink opacity-20 origin-center select-none tracking-tight">
              {t("services.title")}
            </h1>
          </div>

          <div className="flex flex-col pt-24 md:pt-32 pb-20 px-6 md:px-20 relative">
            
            <motion.h1
              className="md:hidden font-serif text-[15vw] leading-[0.8] mb-16 text-ink opacity-90"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {t("services.title")}
            </motion.h1>

            <div className="flex flex-col">
              {OFFERS.map((offer, index) => {
                const isSelected = state.projectType === offer;
                
                return (
                  <div key={offer}>
                    <motion.button
                      onClick={() => handleOfferClick(offer)}
                      className={`
                        group relative w-full text-left py-6 md:py-10
                        border-b border-ink/20 transition-all duration-300
                        ${isSelected ? "bg-ink/[0.02]" : "hover:bg-ink/[0.01] hover:border-ink/40"}
                      `}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-10 transition-transform duration-300 group-hover:translate-x-2">
                        <div className="flex items-center gap-4 flex-1">
                          <motion.span
                            className="font-mono text-xs text-ink/30"
                            animate={{ opacity: isSelected ? 1 : 0.3 }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </motion.span>

                          <motion.div
                            animate={{ rotate: isSelected ? 45 : 0 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className={`${isSelected ? "text-blue" : "text-ink/30 group-hover:text-ink/60"} transition-colors`}
                          >
                            <Plus size={24} strokeWidth={1.5} />
                          </motion.div>

                          <h2 className={`
                            font-serif text-[8vw] md:text-[3.5vw] leading-[0.95]
                            transition-colors duration-300
                            ${isSelected ? "text-blue" : "text-ink group-hover:text-ink/70"}
                          `}>
                            {t(`services.offers.${offer}.title`)}
                          </h2>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                          <div className="flex flex-col md:items-end gap-1 md:max-w-md pl-8 md:pl-0">
                            <span className="font-serif italic text-xl md:text-2xl text-ink/60">
                              {isFr ? "à partir de" : "from"}{" "}
                              {Math.min(...projects[offer].subtypes.map((s) => s.days * TJM)).toLocaleString(isFr ? "fr-FR" : "en-US")} €
                            </span>
                            <p className="font-mono text-xs md:text-sm uppercase tracking-wider text-ink/50 md:text-right max-w-xs">
                              {t(`services.offers.${offer}.description`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden bg-ink/[0.02] border-b border-ink/20"
                        >
                          <div className="py-8 md:py-12 px-4 md:px-8">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                              className="mb-10"
                            >
                              <h3 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6">
                                {isFr ? "Choisir une formule" : "Choose a package"}
                              </h3>
                              <div className="flex flex-col gap-2">
                                {subTypes.map((sub, i) => (
                                  <motion.button
                                    key={sub.id}
                                    onClick={() => { playClick(); setSubType(sub.id); }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                                    className={`
                                      flex items-center justify-between py-4 px-5 text-left
                                      border transition-all duration-300
                                      ${state.subTypeId === sub.id
                                        ? "border-blue bg-blue/5"
                                        : "border-ink/10 hover:border-ink/30"
                                      }
                                    `}
                                  >
                                    <span className="font-serif text-lg md:text-xl text-ink">
                                      {isFr ? sub.name : sub.nameEn}
                                    </span>
                                    <span className="flex flex-col items-end">
                                      <span className="font-mono text-sm md:text-base font-bold text-blue">
                                        {(state.subTypeId === sub.id && customDays !== null
                                          ? customDays * TJM
                                          : sub.days * TJM
                                        ).toLocaleString(isFr ? "fr-FR" : "en-US")} €
                                      </span>
                                      {state.subTypeId === sub.id && customDays !== null && customDays !== sub.days && (
                                        <span className="font-mono text-[10px] text-ink/40">
                                          {isFr ? "en moyenne" : "avg"} {(sub.days * TJM).toLocaleString(isFr ? "fr-FR" : "en-US")} €
                                        </span>
                                      )}
                                    </span>
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15, duration: 0.4 }}
                              className="mb-10"
                            >
                              <h3 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-4">
                                {isFr ? "Durée souhaitée" : "Desired duration"}
                              </h3>
                              <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center border border-ink/20 focus-within:border-blue transition-colors duration-200">
                                  <input
                                    type="number"
                                    min={1}
                                    value={daysInputStr}
                                    onChange={(e) => {
                                      const str = e.target.value;
                                      setDaysInputStr(str);
                                      const num = parseInt(str);
                                      if (!isNaN(num) && num >= 1) {
                                        setCustomDays(num);
                                      }
                                    }}
                                    className="w-16 bg-transparent font-mono text-xl font-bold text-blue px-4 py-3 focus:outline-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    aria-label={isFr ? "Nombre de jours" : "Number of days"}
                                  />
                                  <span className="font-mono text-xs text-ink/40 uppercase pr-4">
                                    {isFr ? "jours" : "days"}
                                  </span>
                                </div>
                                <span className="font-mono text-xs text-ink/40">
                                  {isFr ? "recommandé" : "recommended"} : {currentSubType?.days}j
                                  <span className="mx-2 opacity-50">—</span>
                                  {isFr ? currentSubType?.duration : currentSubType?.durationEn}
                                </span>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.4 }}
                            >
                              <h3 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-6">
                                {isFr ? "Ajouter des options" : "Add options"}
                              </h3>
                              <div className="border-t border-ink/10">
                                  {CATEGORIES.map((category) => (
                                    <OptionCategory
                                      key={category}
                                      category={category}
                                      isOptionSelected={isOptionSelected}
                                      isOptionIncluded={isOptionIncluded}
                                      onToggle={toggleOption}
                                      defaultOpen={false}
                                    />
                                  ))}
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {isSimulatorOpen && currentSubType && (
              <QuoteSummary
                total={total}
                duration={
                  customDays !== null && customDays !== currentSubType.days
                    ? `${customDays} jour${customDays > 1 ? "s" : ""}`
                    : currentSubType.duration
                }
                durationEn={
                  customDays !== null && customDays !== currentSubType.days
                    ? `${customDays} day${customDays > 1 ? "s" : ""}`
                    : currentSubType.durationEn
                }
                onSendQuote={handleSendQuote}
              />
            )}

            <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <p className="font-mono text-sm md:text-base uppercase tracking-widest text-ink/50 whitespace-nowrap">
                TJM — <span className="text-ink font-bold">300 €</span><span className="text-ink/40">/jour</span>
              </p>
              <p className="font-serif italic text-xl md:text-2xl text-ink/50">
                {isFr
                  ? "Chaque projet est unique — discutons de votre besoin."
                  : "Every project is unique — let's talk about yours."}
              </p>
            </div>
          </div>
        </main>
      </section>

      <section className="bg-blue text-white py-20 md:py-32 px-6 md:px-20 relative">
        <div className="max-w-4xl mx-auto md:ml-[calc(clamp(60px,12vw,200px)+5rem)]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-mono text-sm md:text-base font-bold uppercase tracking-widest mb-8 text-white">
              {quoteSummary ? t("services.form.headingWithQuote") : t("services.form.heading")}
            </h2>

            <AnimatePresence mode="wait">
              {quoteSummary && (
                <motion.div
                  key="quote-preview"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-12 overflow-hidden"
                >
                  <div className="bg-white/10 border border-white/20 p-6 font-mono text-sm whitespace-pre-wrap text-white/80">
                    {quoteSummary}
                  </div>
                  <button
                    onClick={() => { playClick(); setQuoteSummary(null); }}
                    className="mt-4 font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                  >
                    {isFr ? "× Effacer la simulation" : "× Clear simulation"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-12 max-w-2xl">
              <div className="relative group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t("services.form.name")}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 font-serif text-2xl md:text-3xl leading-none text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all duration-300 rounded-none"
                />
              </div>

              <div className="relative group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t("services.form.email")}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 font-serif text-2xl md:text-3xl leading-none text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all duration-300 rounded-none"
                />
              </div>

              <div className="relative group">
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={quoteSummary ? t("services.form.messageOptional") : t("services.form.message")}
                  required={!quoteSummary}
                  rows={3}
                  className="w-full bg-transparent border-b border-white/20 py-4 font-serif text-2xl md:text-3xl leading-tight text-white placeholder:text-white/60 focus:outline-none focus:border-white transition-all duration-300 resize-none rounded-none"
                />
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pt-4">
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-white text-blue px-8 py-4 font-mono text-base uppercase tracking-wider font-bold hover:bg-transparent hover:text-white border border-white transition-colors duration-300 disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  {status === "sending" ? t("services.form.sending") : t("services.form.send")}
                </motion.button>

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-serif italic text-xl text-white"
                  >
                    {t("services.form.success")}
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-serif italic text-xl text-red-400"
                  >
                    {t("services.form.error")}
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
