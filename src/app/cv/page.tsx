"use client";

import { useRef, useCallback } from "react";
import { useSound } from "@/hooks/useSound";
import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export default function CVPage() {
  const router = useRouter();
  const { playClick, playExit, playPdfSave } = useSound();
  const { t } = useTranslation();
  const lastSoundTime = useRef(0);

  const handleSound = useCallback((soundFn: () => void) => {
    const now = Date.now();
    if (now - lastSoundTime.current < 100) return;
    lastSoundTime.current = now;
    soundFn();
  }, []);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSound(playExit);
    setTimeout(() => {
      router.push("/?skipIntro=true");
    }, 80);
  };

  const handleDownload = async () => {
    handleSound(playPdfSave);
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const element = document.getElementById("cv-print-template");
    if (!element) return;

    // Use a higher scale for printing quality
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#f9f9f9",
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Safety: if the rendered template still slightly exceeds A4 height, scale it down to fit
    if (imgHeight > pdfHeight) {
      const scale = pdfHeight / imgHeight;
      pdf.addImage(imgData, "JPEG", (pdfWidth - pdfWidth * scale) / 2, 0, pdfWidth * scale, pdfHeight);
    } else {
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
    }

    pdf.save("enzo-gazzoli-cv.pdf");
  };

  return (
    <div className="min-h-screen bg-bg text-ink overflow-x-hidden p-0 m-0">
      {/* --- HIDDEN PRINT TEMPLATE --- */}
      <div className="absolute left-[-9999px] top-0">
        <div
          id="cv-print-template"
          className="bg-[#f9f9f9] text-black font-mono overflow-hidden"
          style={{ width: "210mm", height: "297mm", padding: "8mm", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "6mm" }}
        >
          {/* HEADER */}
          <section className="bg-blue p-8 relative overflow-hidden" style={{ minHeight: "60mm" }}>
            <h1 className="font-serif text-[50pt] leading-[0.7] tracking-[-0.06em] lowercase text-white mb-6">
              enzo <br /> gazzoli
            </h1>
            <p className="font-serif text-[20pt] leading-[0.8] italic text-white/90 lowercase tracking-tighter">
              {t("cv.developer").split(" ")[0]} <br /> {t("cv.developer").split(" ")[1] || "fullstack"}
            </p>
          </section>

          {/* CONNECT & STATUS */}
          <div className="grid grid-cols-12 gap-5" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)" }}>
            <section className="col-span-4 bg-black p-6 flex flex-col justify-between text-white" style={{ gridColumn: "span 4", minHeight: "45mm" }}>
              <div>
                <span className="text-[26pt] leading-none font-black tracking-[-0.07em] block mb-4">{t("cv.connect")}</span>
                <div className="space-y-2">
                  <span className="block font-serif text-[10.5pt] lowercase italic underline decoration-white/10">enzo.gazzoli@icloud.com</span>
                  <div className="flex flex-col gap-1 pt-4 mt-4 border-t border-white/10">
                    <span className="text-[6pt] tracking-[0.3em]">GITHUB.COM/TAQINOU</span>
                    <span className="text-[6pt] tracking-[0.3em]">LINKEDIN/ENZO-GAZZOLI</span>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <span className="border border-white/30 px-3 pt-[1.5pt] pb-[6.5pt] inline-block text-[7pt] tracking-widest uppercase leading-none">
                  NANCY, FR
                </span>
              </div>
            </section>

            <section className="col-span-8 border-[3pt] border-blue p-6 flex flex-col justify-center" style={{ gridColumn: "span 8" }}>
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-blue font-black text-[32pt] leading-none tracking-[-0.05em]">{t("cv.status")}</span>
                <span className="bg-blue text-white px-3 pt-0 pb-[8pt] inline-block text-[8pt] font-bold tracking-widest uppercase leading-none">
                  {t("cv.freelance")}
                </span>
              </div>
              <p className="font-serif text-[17pt] leading-[0.85] lowercase tracking-tighter italic text-black/80">
                {t("cv.statusDescription")}
              </p>
            </section>
          </div>

          {/* CURRICULUM & PROJECTS */}
          <div className="grid grid-cols-2 gap-5" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
            <section className="p-6 border-t-[8pt] border-black">
              <header className="mb-4 border-b border-black/10 pb-4">
                <span className="text-[20pt] leading-none font-black tracking-[-0.05em] text-black uppercase">{t("cv.curriculum")}</span>
              </header>
              <div className="space-y-5">
                <article>
                  <span className="text-blue font-bold tracking-widest text-[7pt] block mb-1">{t("cv.experience.present")}</span>
                  <h3 className="font-serif text-[15pt] lowercase italic tracking-tight mb-2">{t("cv.experience.freelanceTitle")}</h3>
                  <p className="text-[7.5pt] text-black/60 uppercase tracking-widest leading-relaxed">
                    {t("cv.experience.freelanceDesc")}
                  </p>
                </article>
                <article>
                  <span className="text-blue font-bold tracking-widest text-[7pt] block mb-1">{t("cv.experience.2024")}</span>
                  <h3 className="font-serif text-[15pt] lowercase italic tracking-tight mb-2">{t("cv.experience.internshipTitle")}</h3>
                  <p className="text-[7.5pt] text-black/60 uppercase tracking-widest leading-relaxed">
                    {t("cv.experience.internshipDesc")}
                  </p>
                </article>
              </div>
            </section>

            <section className="bg-blue/5 p-6 border-t-[8pt] border-blue">
              <header className="mb-4 border-b border-blue/10 pb-4">
                <span className="text-[20pt] leading-none font-black tracking-[-0.05em] text-blue uppercase">{t("cv.projects")}</span>
              </header>
              <div className="space-y-5">
                <article>
                  <h4 className="font-serif text-[30pt] leading-[1.1] lowercase tracking-[-0.06em] mb-4">sneakerscope</h4>
                  <p className="text-[7pt] text-black/50 uppercase tracking-[0.2em] leading-relaxed">
                    {t("cv.projectDescriptions.sneakerscope")}
                  </p>
                </article>
                <article>
                  <h4 className="font-serif text-[30pt] leading-[1.1] lowercase tracking-[-0.06em] mb-4">lumière de soso</h4>
                  <p className="text-[7pt] text-black/50 uppercase tracking-[0.2em] leading-relaxed">
                    {t("cv.projectDescriptions.lumiere")}
                  </p>
                </article>
              </div>
            </section>
          </div>

          {/* STACK & EDUCATION */}
          <div className="grid grid-cols-4 gap-5" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="col-span-1 p-5 bg-blue text-white flex flex-col justify-end" style={{ gridColumn: "span 1", minHeight: "32mm" }}>
              <span className="text-[16pt] leading-none font-black tracking-tighter uppercase mb-2">{t("cv.stack")}</span>
              <div className="flex flex-wrap gap-x-2 gap-y-1 opacity-80 text-[7.5pt] uppercase tracking-widest font-bold">
                <span>Next.js</span> <span>React</span> <span>Framer</span> <span>TS</span> <span>Shopify</span> <span>PSQL</span> <span>Tailwind</span> <span>Docker</span> <span>Git</span> <span>Python</span>
              </div>
            </div>

            <div className="col-span-3 p-5 border-[3pt] border-black flex items-end justify-between" style={{ gridColumn: "span 3", minHeight: "32mm" }}>
              <div className="space-y-4">
                <div>
                  <span className="text-[6.5pt] text-black/30 tracking-[0.5em] uppercase block mb-1">{t("cv.education")}</span>
                  <h3 className="font-serif text-[16pt] lowercase italic tracking-tighter">{t("cv.degrees.licence")}</h3>
                  <p className="font-mono text-[8pt] text-blue font-bold tracking-[0.2em]">INU CHAMPOLLION / 2025</p>
                </div>
                <div>
                  <h3 className="font-serif text-[16pt] lowercase italic tracking-tighter">{t("cv.degrees.bac")}</h3>
                  <p className="font-mono text-[8pt] text-blue font-bold tracking-[0.2em]">LYCÉE PAUL SABATIER / 2022</p>
                </div>
              </div>
              <span className="opacity-5 text-black font-black text-[45pt] leading-none">EDU</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- WEB NAV --- */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-baseline px-10 py-8 z-[100] mix-blend-difference pointer-events-none">
        <a
          href="/?skipIntro=true"
          onClick={handleBack}
          className="font-serif text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors"
        >
          {t("cv.index")}
        </a>
        <button
          onClick={handleDownload}
          className="font-serif text-2xl italic lowercase text-white/50 hover:text-white pointer-events-auto transition-colors"
        >
          {t("cv.saveAsPdf")}
        </button>
      </nav>

      {/* --- WEB MAIN CONTENT --- */}
      <main id="cv-content" className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-12 lg:py-20 flex flex-col gap-8 lg:gap-12 font-mono">

        {/* === HEADER BLOCK (BLUE) === */}
        <section className="bg-blue p-6 md:p-8 lg:p-12 relative overflow-hidden group min-h-[280px] md:min-h-0">
          <div className="photo-placeholder absolute bottom-4 right-4 md:top-1/2 md:bottom-auto md:right-[15%] md:-translate-y-1/2 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none text-center">
            <span className="text-[clamp(3rem,10vw,8rem)] leading-[0.7] tracking-tighter text-white font-black uppercase">{t("cv.photo")}</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <h1 className="font-serif text-[clamp(3.5rem,14vw,18rem)] leading-[0.7] tracking-[-0.06em] lowercase text-white mb-6 md:mb-10">
              enzo <br /> gazzoli
            </h1>
            <p className="font-serif text-[clamp(1.3rem,4vw,5rem)] leading-[0.8] italic text-white/90 lowercase tracking-tighter">
              {t("cv.developer").split(" ")[0]} <br /> {t("cv.developer").split(" ")[1] || "fullstack"}
            </p>
          </motion.div>
        </section>

        {/* === INFO BLOCK (BLACK / ASYMMETRIC) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          <section className="lg:col-span-4 bg-ink p-6 lg:p-10 flex flex-col justify-between text-bg order-2 lg:order-1 min-h-[320px] overflow-hidden">
            <div>
              <span className="text-[clamp(2rem,5.5vw,7.5rem)] leading-[0.7] font-black tracking-[-0.07em] block mb-8">{t("cv.connect")}</span>
              <div className="space-y-4">
                <a
                  href="mailto:enzo.gazzoli@icloud.com"
                  onClick={() => playClick()}
                  className="block font-serif text-2xl lowercase italic hover:text-blue transition-colors underline underline-offset-8 decoration-bg/10"
                >
                  enzo.gazzoli@icloud.com
                </a>
                <div className="flex flex-col gap-3 pt-8 mt-8 border-t border-bg/10">
                  <a href="https://github.com/Taqinou" onClick={() => playClick()} className="text-xs tracking-[0.3em] hover:text-blue">GITHUB.COM/TAQINOU</a>
                  <a href="https://linkedin.com/in/enzo-gazzoli" onClick={() => playClick()} className="text-xs tracking-[0.3em] hover:text-blue">LINKEDIN/ENZO-GAZZOLI</a>
                </div>
              </div>
            </div>
            <div className="pt-12">
              <span className="text-[10px] px-3 py-1.5 border border-bg/30 text-bg inline-block mb-4 tracking-widest">NANCY, FR</span>
            </div>
          </section>

          {/* === STATUS / INTRO (WHITE) === */}
          <section className="lg:col-span-8 border-4 border-blue p-6 lg:p-10 order-1 lg:order-2">
            <div className="flex justify-between items-start mb-10">
              <span className="text-blue font-black text-[clamp(3rem,8vw,10rem)] leading-[0.7] tracking-[-0.05em]">{t("cv.status")}</span>
              <div className="bg-blue text-white p-3 font-mono text-[clamp(0.8rem,1.5vw,1.2rem)] font-bold tracking-widest">
                {t("cv.freelance")}
              </div>
            </div>
            <div className="max-w-none">
              <p className="font-serif text-3xl md:text-5xl leading-[0.85] lowercase tracking-tighter italic text-ink/80">
                {t("cv.statusDescription")}
              </p>
            </div>
          </section>

        </div>

        {/* === MAIN CONTENT (CURRICULUM / SELECTED) === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* CURRICULUM */}
          <section className="bg-ink/5 p-8 lg:p-16 border-t-[20px] border-ink">
            <header className="flex justify-between items-end mb-16 border-b border-ink/10 pb-8">
              <span className="text-[clamp(1.5rem,4vw,6rem)] leading-[0.7] font-black tracking-[-0.05em] text-ink uppercase">{t("cv.curriculum")}</span>
            </header>

            <div className="space-y-12">
              <article>
                <div className="mb-4">
                  <span className="text-blue font-bold tracking-widest text-[11px]">{t("cv.experience.present")}</span>
                </div>
                <h3 className="font-serif text-4xl lowercase italic tracking-tight mb-4">{t("cv.experience.freelanceTitle")}</h3>
                <p className="text-xs text-ink/60 uppercase tracking-widest leading-relaxed">
                  {t("cv.experience.freelanceDesc")}
                </p>
              </article>

              <article>
                <div className="mb-4">
                  <span className="text-blue font-bold tracking-widest text-[11px]">{t("cv.experience.2024")}</span>
                </div>
                <h3 className="font-serif text-4xl lowercase italic tracking-tight mb-4">{t("cv.experience.internshipTitle")}</h3>
                <p className="text-xs text-ink/60 uppercase tracking-widest leading-relaxed">
                  {t("cv.experience.internshipDesc")}
                </p>
              </article>
            </div>
          </section>

          {/* SELECTED PROJECTS */}
          <section className="bg-blue/5 p-8 lg:p-16 border-t-[20px] border-blue">
            <header className="flex justify-between items-end mb-16 border-b border-blue/10 pb-8">
              <span className="text-[clamp(1.5rem,4vw,6rem)] leading-[0.7] font-black tracking-[-0.05em] text-blue uppercase">{t("cv.projects")}</span>
            </header>

            <div className="space-y-12">
              <article className="group group-hover:bg-blue">
                <h4 className="font-serif text-[clamp(2.5rem,7vw,10rem)] leading-[0.7] lowercase tracking-[-0.06em] group-hover:text-blue transition-colors duration-500 mb-6">sneakerscope</h4>
                <p className="text-xs text-ink/50 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                  {t("cv.projectDescriptions.sneakerscope")}
                </p>
              </article>

              <article className="group">
                <h4 className="font-serif text-[clamp(2.5rem,7vw,10rem)] leading-[0.7] lowercase tracking-[-0.06em] group-hover:text-blue transition-colors duration-500 mb-6">lumière de soso</h4>
                <p className="text-xs text-ink/50 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                  {t("cv.projectDescriptions.lumiere")}
                </p>
              </article>
            </div>
          </section>

        </div>

        {/* === STACK / EDUCATION GRID === */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1 p-8 bg-blue text-white flex flex-col justify-end min-h-[250px]">
            <span className="text-[clamp(1.5rem,3vw,5rem)] leading-[0.7] font-black tracking-tighter uppercase mb-4">{t("cv.stack")}</span>
            <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-60 text-[9px] uppercase tracking-widest font-bold">
              <span>Next.js</span> <span>React</span> <span>Framer Motion</span> <span>TypeScript</span> <span>Shopify</span> <span>PostgreSQL</span> <span>Tailwind</span> <span>Docker</span> <span>Git</span> <span>Redis</span> <span>Python</span>
            </div>
          </div>

          <div className="lg:col-span-3 p-8 border-4 border-ink flex items-end justify-between min-h-[250px]">
            <div className="space-y-8">
              <div>
                <span className="text-[10px] text-ink/30 tracking-[0.5em] uppercase block mb-4">{t("cv.education")}</span>
                <h3 className="font-serif text-4xl md:text-5xl lowercase italic tracking-tighter">{t("cv.degrees.licence")}</h3>
                <p className="font-mono text-xs text-blue font-bold tracking-[0.2em] mt-1">INU CHAMPOLLION / 2025</p>
              </div>
              <div>
                <h3 className="font-serif text-4xl md:text-5xl lowercase italic tracking-tighter">{t("cv.degrees.bac")}</h3>
                <p className="font-mono text-xs text-blue font-bold tracking-[0.2em] mt-1">LYCÉE PAUL SABATIER / 2022</p>
              </div>
            </div>
            <span className="hidden md:block opacity-5 text-ink font-black text-9xl leading-none">EDU</span>
          </div>
        </div>


      </main>

      {/* --- TEXTURE --- */}
      <div className="fixed inset-0 pointer-events-none z-[200] opacity-[0.03] grayscale contrast-150 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div >
  );
}
