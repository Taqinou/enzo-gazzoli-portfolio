"use client";

import { useState, FormEvent, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";

const OFFERS = ["website", "application", "custom"] as const;

export default function ServicesPage() {
  const router = useRouter();
  const { playClick, playExit } = useSound();
  const { t } = useTranslation();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playExit();
    setTimeout(() => {
      router.push("/?skipIntro=true");
    }, 80);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    playClick();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

            <div className="flex flex-col gap-8 md:gap-0 mb-20 md:mb-32">
              {OFFERS.map((offer, i) => (
                <div
                  key={offer}
                  className="group relative md:border-b md:border-ink/20 py-0 md:py-10"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 md:gap-10">
                    <h2 className="font-serif text-[8vw] md:text-[3.5vw] leading-[0.95] text-ink">
                      {t(`services.offers.${offer}.title`)}
                    </h2>
                    
                    <div className="flex flex-col md:items-end gap-1 md:max-w-md">
                      <span className="font-serif italic text-xl md:text-2xl text-ink/60">
                        {t(`services.offers.${offer}.price`)}
                      </span>
                      <p className="font-mono text-xs md:text-sm uppercase tracking-wider text-ink/50 md:text-right max-w-xs">
                        {t(`services.offers.${offer}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
            <h2 className="font-mono text-sm md:text-base font-bold uppercase tracking-widest mb-12 text-white">
              {t("services.form.heading")}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-12 max-w-2xl">
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

      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
