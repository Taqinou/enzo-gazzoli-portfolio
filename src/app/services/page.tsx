"use client";

import { useState, FormEvent, useRef } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuoteSimulator } from "@/hooks/useQuoteSimulator";
import { Formula, ProjectType, projects } from "@/data/pricing";
import BlurFade from "@/components/ui/BlurFade";

const OFFERS: ProjectType[] = ["website", "application", "shopify", "ai"];

export default function ServicesPage() {
  const router = useRouter();
  const { playClick, playExit } = useSound();
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const { state, toggleProjectType, setFormula } = useQuoteSimulator();

  const isFr = locale === "fr";

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/");
    }, 80);
  };

  const prefillMessage = (message: string) => {
    setFormData((prev) => ({ ...prev, message }));
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const formulaMessage = (formula: Formula) => {
    const name = isFr ? formula.name : formula.nameEn;
    const price = formula.price.toLocaleString(isFr ? "fr-FR" : "en-US");
    return isFr
      ? `Bonjour, je suis intéressé par la formule « ${name} » (à partir de ${price} €). `
      : `Hi, I'm interested in the "${name}" package (from ${price} €). `;
  };

  // Clic sur une offre. Seule l'offre 01 propose des formules : elle déplie sa
  // liste. Les offres globales n'ont rien à déplier, le clic mène droit au
  // formulaire avec le message pré-rempli.
  const handleOfferClick = (type: ProjectType) => {
    playClick();

    if (projects[type].formulas.length === 0) {
      const label = t(`services.simulator.types.${type}`);
      prefillMessage(
        isFr
          ? `Bonjour, je suis intéressé par une prestation « ${label} ». `
          : `Hi, I'm interested in a "${label}" project. `
      );
      return;
    }

    toggleProjectType(type);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClick();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
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
          href="/"
          onClick={handleBack}
          className="font-serif text-xl md:text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors duration-300"
        >
          {t("services.index")}
        </a>
      </nav>

      <section className="bg-bg text-ink min-h-screen relative">
        <main className="relative grid grid-cols-1 md:grid-cols-[clamp(60px,12vw,200px)_1fr]">

          <div className="hidden md:flex sticky top-0 h-screen flex-col items-center justify-center border-r border-ink/10 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-transparent origin-bottom"
              style={{ scaleY: scrollYProgress }}
            />
            <motion.h1
              className="whitespace-nowrap font-serif text-[min(11vh,9vw,180px)] text-ink origin-center select-none tracking-tight"
              initial={{ opacity: 0, filter: "blur(12px)", rotate: -90 }}
              animate={{ opacity: 0.2, filter: "blur(0px)", rotate: -90 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              {t("services.title")}
            </motion.h1>
          </div>

          <div className="flex flex-col pt-24 md:pt-32 pb-20 px-6 md:px-20 relative">

            <motion.h1
              className="md:hidden font-serif text-[15vw] leading-[0.8] mb-16 text-ink opacity-90"
              initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {t("services.title")}
            </motion.h1>

            <div className="flex flex-col">
              {OFFERS.map((offer, index) => {
                const isSelected = state.projectType === offer;
                const { fromPrice, formulas } = projects[offer];

                return (
                  <BlurFade key={offer} inView delay={index * 0.08}>
                  <div>
                    <motion.button
                      onClick={() => handleOfferClick(offer)}
                      className={`
                        group relative w-full text-left py-6 md:py-10
                        border-b border-ink/20 transition-all duration-300
                        ${isSelected ? "" : "hover:border-ink/40"}
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

                          {/* Le « + » annonce un dépli : il n'a de sens que
                              sur l'offre qui en a un. Les offres globales, qui
                              mènent droit au formulaire, portent la flèche
                              employée partout ailleurs sur le site. */}
                          {formulas.length > 0 ? (
                            <motion.div
                              animate={{ rotate: isSelected ? 45 : 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className={`shrink-0 ${isSelected ? "text-blue" : "text-ink/30 group-hover:text-ink/60"} transition-colors`}
                            >
                              <Plus size={24} strokeWidth={1.5} />
                            </motion.div>
                          ) : (
                            <span
                              aria-hidden="true"
                              className="shrink-0 w-6 text-center font-serif text-2xl text-ink/30 group-hover:text-ink/60 transition-colors"
                            >
                              →
                            </span>
                          )}

                          {/* text-[2.8vw] : les intitulés de la nouvelle
                              taxonomie sont plus longs qu'avant, ils doivent
                              tenir à côté du prix sans écraser la colonne de
                              droite. */}
                          <h2 className={`
                            font-serif text-[7vw] md:text-[2.8vw] leading-[0.95]
                            transition-colors duration-300
                            ${isSelected ? "text-blue" : "text-ink group-hover:text-ink/70"}
                          `}>
                            {t(`services.offers.${offer}.title`)}
                          </h2>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                          <div className="flex flex-col md:items-end gap-1 md:max-w-md pl-8 md:pl-0">
                            <span className="font-serif italic text-xl md:text-2xl text-ink/60 whitespace-nowrap">
                              {isFr ? "à partir de" : "from"}{" "}
                              {fromPrice.toLocaleString(isFr ? "fr-FR" : "en-US")} €
                            </span>
                            <p className="font-mono text-xs md:text-sm uppercase tracking-wider text-ink/50 md:text-right max-w-md">
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
                          className="overflow-hidden border-b border-ink/20"
                        >
                          {/* Le volet ne s'ouvre que pour une offre à
                              formules : il n'y a rien d'autre à y montrer. */}
                          <div className="py-8 md:py-12 px-4 md:px-8">
                            <div className="flex flex-col gap-2">
                              {formulas.map((formula, i) => (
                                <motion.button
                                  key={formula.id}
                                  onClick={() => {
                                    playClick();
                                    setFormula(formula.id);
                                    prefillMessage(formulaMessage(formula));
                                  }}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                                  className={`
                                    group/sub flex items-center justify-between gap-6 py-4 px-5 text-left
                                    border transition-all duration-300
                                    ${state.formulaId === formula.id
                                      ? "border-blue bg-blue/5"
                                      : "border-ink/10 hover:border-ink/30"
                                    }
                                  `}
                                >
                                  <span className="font-serif text-lg md:text-xl text-ink">
                                    {isFr ? formula.name : formula.nameEn}
                                  </span>
                                  <span className="flex items-center gap-3">
                                    <span className="font-mono text-sm md:text-base font-bold text-blue whitespace-nowrap">
                                      {formula.price.toLocaleString(isFr ? "fr-FR" : "en-US")} €
                                    </span>
                                    <span className="font-mono text-blue opacity-0 -translate-x-1 transition-all duration-300 group-hover/sub:opacity-100 group-hover/sub:translate-x-0">
                                      →
                                    </span>
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  </BlurFade>
                );
              })}
            </div>
          </div>
        </main>
      </section>

      <section id="contact" className="bg-blue text-white py-20 md:py-32 px-6 md:px-20 relative scroll-mt-10">
        <div className="max-w-4xl mx-auto lg:ml-[calc(clamp(60px,12vw,200px)+5rem)]">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-mono text-sm md:text-base font-bold uppercase tracking-widest mb-8 text-white">
              {t("services.form.heading")}
            </h2>

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
                  placeholder={t("services.form.message")}
                  required
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

    </div>
  );
}
