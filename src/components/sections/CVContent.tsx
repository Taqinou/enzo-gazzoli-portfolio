"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useSound } from "@/hooks/useSound";
import { PERSONAL, SOCIAL_LINKS } from "@/data/constants";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

interface CVContentProps {
  variant: "print" | "web";
}

export function CVContent({ variant }: CVContentProps) {
  const { t } = useTranslation();
  const { playClick } = useSound();

  const isPrint = variant === "print";

  // Common content with conditional styling
  return (
    <div
      id={isPrint ? "cv-print-template" : "cv-content"}
      className={
        isPrint
          ? "bg-[#f9f9f9] text-black font-mono overflow-hidden"
          : "relative z-10 w-full max-w-[1400px] mx-auto px-6 py-12 lg:py-20 flex flex-col gap-8 lg:gap-12 font-mono"
      }
      style={
        isPrint
          ? { width: "210mm", height: "297mm", padding: "8mm", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "6mm" }
          : undefined
      }
    >
      {/* HEADER BLOCK (BLUE) */}
      <section 
        className={`${isPrint ? "p-8" : "p-6 md:p-8 lg:p-12"} bg-blue relative overflow-hidden group ${!isPrint ? "min-h-[280px] md:min-h-0" : ""}`}
        style={isPrint ? { minHeight: "60mm" } : undefined}
      >
        {isPrint ? (
            /* Using flex container + auto height to force aspect ratio preservation in html2canvas */
            <div className="absolute pointer-events-none z-50 flex justify-center items-start overflow-hidden" 
                 style={{ top: "5mm", right: "5mm", height: "50mm", width: "40mm" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                    src="/images/profile-picture.jpg" 
                    alt="Enzo Gazzoli"
                    style={{ 
                        width: "100%", 
                        height: "auto",
                        minHeight: "100%",
                        objectFit: "cover" // Fallback
                    }}
                />
            </div>
        ) : (
            <div className="absolute top-28 right-6 w-[28vw] md:top-6 md:w-1/4 max-w-[300px] h-auto md:bottom-6 pointer-events-none">
                <div className="relative w-full aspect-[3/4] md:aspect-auto md:h-full">
                    <Image 
                        src="/images/profile-picture.jpg" 
                        alt={t("cv.photo")}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>
        )}
        
        {isPrint ? (
            <div>
                <h1 className="font-serif text-[50pt] leading-[0.7] tracking-[-0.06em] lowercase text-white mb-6">
                    enzo <br /> gazzoli
                </h1>
                <p className="font-serif text-[20pt] leading-[0.8] italic text-white/90 lowercase tracking-tighter">
                    {t("cv.developer").split(" ")[0]} <br /> {t("cv.developer").split(" ")[1] || "fullstack"}
                </p>
            </div>
        ) : (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: easeOutExpo }}
                className="mt-20 md:mt-0 flex flex-col justify-center md:block h-full md:h-auto"
            >
                <h1 className="font-serif text-[clamp(3.5rem,15vw,18rem)] leading-[0.7] tracking-[-0.06em] lowercase text-white mb-6 md:mb-10">
                    enzo <br /> gazzoli
                </h1>
                <p className="font-serif text-[clamp(1.5rem,5vw,5rem)] leading-[0.8] italic text-white/90 lowercase tracking-tighter mt-4 md:mt-0">
                    {t("cv.developer").split(" ")[0]} <br /> {t("cv.developer").split(" ")[1] || "fullstack"}
                </p>
            </motion.div>
        )}
      </section>

      {/* INFO BLOCK (BLACK / ASYMMETRIC) & STATUS */}
      <div 
        className={isPrint ? "grid grid-cols-12 gap-5" : "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"}
        style={isPrint ? { display: "grid", gridTemplateColumns: "repeat(12, 1fr)" } : undefined}
      >
        <section 
            className={`
                ${isPrint ? "col-span-4 bg-black p-6" : "lg:col-span-4 bg-ink p-6 lg:p-10 order-2 lg:order-1 min-h-[320px]"} 
                flex flex-col justify-between ${isPrint ? "text-white" : "text-bg"} overflow-hidden
            `}
            style={isPrint ? { gridColumn: "span 4", minHeight: "45mm" } : undefined}
        >
            <div>
                <span className={`${isPrint ? "text-[26pt]" : "text-[clamp(2rem,5.5vw,7.5rem)]"} leading-[0.7] font-black tracking-[-0.07em] block ${isPrint ? "mb-4" : "mb-8"}`}>
                    {t("cv.connect")}
                </span>
                <div className={isPrint ? "space-y-2" : "space-y-4"}>
                    {isPrint ? (
                         <span className="block font-serif text-[10.5pt] lowercase italic underline decoration-white/10">{PERSONAL.email}</span>
                    ) : (
                        <a
                            href="mailto:{PERSONAL.email}"
                            onClick={() => playClick()}
                            className="block font-serif text-2xl lowercase italic hover:text-blue transition-colors underline underline-offset-8 decoration-bg/10"
                        >
                            {PERSONAL.email}
                        </a>
                    )}
                   
                    <div className={`flex flex-col ${isPrint ? "gap-1 pt-4 mt-4 border-t border-white/10" : "gap-3 pt-8 mt-8 border-t border-bg/10"}`}>
                        {isPrint ? (
                            <>
                                <span className="text-[6pt] tracking-[0.3em]">GITHUB.COM/TAQINOU</span>
                                <span className="text-[6pt] tracking-[0.3em]">LINKEDIN/ENZO-GAZZOLI</span>
                            </>
                        ) : (
                            <>
                                <a href={SOCIAL_LINKS.github} onClick={() => playClick()} className="text-xs tracking-[0.3em] hover:text-blue">GITHUB.COM/TAQINOU</a>
                                <a href={SOCIAL_LINKS.linkedin} onClick={() => playClick()} className="text-xs tracking-[0.3em] hover:text-blue">LINKEDIN/ENZO-GAZZOLI</a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={isPrint ? "pt-2" : "pt-12"}>
                <span className={`${isPrint ? "border-white/30 text-[7pt] pt-[1.5pt] pb-[6.5pt]" : "border-bg/30 text-[10px] text-bg mb-4 px-3 py-1.5"} border inline-block tracking-widest uppercase leading-none`}>
                  NANCY, FR
                </span>
            </div>
        </section>

        <section 
            className={`${isPrint ? "col-span-8 border-[3pt]" : "lg:col-span-8 border-4 order-1 lg:order-2"} border-blue p-6 ${!isPrint && "lg:p-10"} flex flex-col justify-center`}
            style={isPrint ? { gridColumn: "span 8" } : undefined}
        >
            <div className={`flex justify-between items-${isPrint ? "baseline" : "start"} ${isPrint ? "mb-6" : "mb-10"}`}>
                <span className={`text-blue font-black ${isPrint ? "text-[32pt]" : "text-[clamp(3rem,8vw,10rem)]"} leading-none tracking-[-0.05em]`}>{t("cv.status")}</span>
                <span className={`bg-blue text-white ${isPrint ? "px-3 pt-0 pb-[8pt] text-[8pt]" : "p-3 text-[clamp(0.8rem,1.5vw,1.2rem)]"} font-bold tracking-widest uppercase leading-none`}>
                  {t("cv.freelance")}
                </span>
            </div>
            <div className={!isPrint ? "max-w-none" : undefined}>
                <p className={`font-serif ${isPrint ? "text-[17pt]" : "text-3xl md:text-5xl"} leading-[0.85] lowercase tracking-tighter italic ${isPrint ? "text-black/80" : "text-ink/80"}`}>
                    {t("cv.statusDescription")}
                </p>
            </div>
        </section>
      </div>

      {/* CURRICULUM & PROJECTS */}
      <div 
        className={isPrint ? "grid grid-cols-2 gap-5" : "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"}
        style={isPrint ? { display: "grid", gridTemplateColumns: "repeat(2, 1fr)" } : undefined}
      >
        <section className={`${isPrint ? "p-6 border-t-[8pt]" : "bg-ink/5 p-8 lg:p-16 border-t-[20px]"} border-black`}>
            <header className={`${isPrint ? "mb-4 border-black/10 pb-4" : "flex justify-between items-end mb-16 border-ink/10 pb-8"} border-b`}>
                <span className={`${isPrint ? "text-[20pt]" : "text-[clamp(1.5rem,4vw,6rem)] leading-[0.7]"} font-black tracking-[-0.05em] ${isPrint ? "text-black" : "text-ink"} uppercase`}>{t("cv.curriculum")}</span>
            </header>
            <div className={isPrint ? "space-y-5" : "space-y-12"}>
                <article>
                    <div className={!isPrint ? "mb-4" : undefined}>
                        <span className={`text-blue font-bold tracking-widest ${isPrint ? "text-[7pt] block mb-1" : "text-[11px]"}`}>{t("cv.experience.present")}</span>
                    </div>
                    <h3 className={`font-serif ${isPrint ? "text-[15pt] mb-2" : "text-4xl mb-4"} lowercase italic tracking-tight`}>{t("cv.experience.freelanceTitle")}</h3>
                    <p className={`${isPrint ? "text-[7.5pt] text-black/60" : "text-xs text-ink/60"} uppercase tracking-widest leading-relaxed`}>
                        {t("cv.experience.freelanceDesc")}
                    </p>
                </article>
                <article>
                    <div className={!isPrint ? "mb-4" : undefined}>
                         <span className={`text-blue font-bold tracking-widest ${isPrint ? "text-[7pt] block mb-1" : "text-[11px]"}`}>{t("cv.experience.2024")}</span>
                    </div>
                    <h3 className={`font-serif ${isPrint ? "text-[15pt] mb-2" : "text-4xl mb-4"} lowercase italic tracking-tight`}>{t("cv.experience.internshipTitle")}</h3>
                    <p className={`${isPrint ? "text-[7.5pt] text-black/60" : "text-xs text-ink/60"} uppercase tracking-widest leading-relaxed`}>
                        {t("cv.experience.internshipDesc")}
                    </p>
                </article>
            </div>
        </section>

        <section className={`${isPrint ? "bg-blue/5 p-6 border-t-[8pt]" : "bg-blue/5 p-8 lg:p-16 border-t-[20px]"} border-blue`}>
             <header className={`${isPrint ? "mb-4 border-blue/10 pb-4" : "flex justify-between items-end mb-16 border-blue/10 pb-8"} border-b`}>
                <span className={`${isPrint ? "text-[20pt]" : "text-[clamp(1.5rem,4vw,6rem)] leading-[0.7]"} font-black tracking-[-0.05em] text-blue uppercase`}>{t("cv.projects")}</span>
             </header>
             <div className={isPrint ? "space-y-5" : "space-y-12"}>
                <article className={!isPrint ? "group group-hover:bg-blue" : undefined}>
                    <h4 className={`font-serif ${isPrint ? "text-[30pt] leading-[1.1]" : "text-[clamp(2.5rem,7vw,10rem)] leading-[0.7] group-hover:text-blue transition-colors duration-500"} lowercase tracking-[-0.06em] mb-4 ${!isPrint ? "mb-6" : ""}`}>sneakerscope</h4>
                    <p className={`${isPrint ? "text-[7pt] text-black/50" : "text-xs text-ink/50 max-w-sm"} uppercase tracking-[0.2em] leading-relaxed`}>
                        {t("cv.projectDescriptions.sneakerscope")}
                    </p>
                </article>
                <article className={!isPrint ? "group" : undefined}>
                    <h4 className={`font-serif ${isPrint ? "text-[30pt] leading-[1.1]" : "text-[clamp(2.5rem,7vw,10rem)] leading-[0.7] group-hover:text-blue transition-colors duration-500"} lowercase tracking-[-0.06em] mb-4 ${!isPrint ? "mb-6" : ""}`}>lumière de soso</h4>
                    <p className={`${isPrint ? "text-[7pt] text-black/50" : "text-xs text-ink/50 max-w-sm"} uppercase tracking-[0.2em] leading-relaxed`}>
                        {t("cv.projectDescriptions.lumiere")}
                    </p>
                </article>
             </div>
        </section>
      </div>

      {/* STACK & EDUCATION */}
      <div 
        className={isPrint ? "grid grid-cols-4 gap-5" : "grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12"}
        style={isPrint ? { display: "grid", gridTemplateColumns: "repeat(4, 1fr)" } : undefined}
      >
        <div 
            className={`${isPrint ? "col-span-1 p-5" : "lg:col-span-1 p-8 min-h-[250px]"} bg-blue text-white flex flex-col justify-end`}
            style={isPrint ? { gridColumn: "span 1", minHeight: "32mm" } : undefined}
        >
             <span className={`${isPrint ? "text-[16pt]" : "text-[clamp(1.5rem,3vw,5rem)]"} leading-[0.7] font-black tracking-tighter uppercase mb-2 ${!isPrint ? "mb-4" : ""}`}>{t("cv.stack")}</span>
             <div className={`flex flex-wrap ${isPrint ? "gap-x-2 gap-y-1 opacity-80 text-[7.5pt]" : "gap-x-3 gap-y-1 opacity-60 text-[9px]"} uppercase tracking-widest font-bold`}>
                <span>Next.js</span> <span>React</span> <span>Framer{isPrint ? "" : " Motion"}</span> <span>{isPrint ? "TS" : "TypeScript"}</span> <span>Shopify</span> <span>{isPrint ? "PSQL" : "PostgreSQL"}</span> <span>Tailwind</span> <span>Docker</span> <span>Git</span> <span>{!isPrint && "Redis"}</span> <span>Python</span>
             </div>
        </div>

        <div 
            className={`${isPrint ? "col-span-3 p-5 border-[3pt]" : "lg:col-span-3 p-8 border-4 min-h-[250px]"} border-${isPrint ? "black" : "ink"} flex items-end justify-between`}
            style={isPrint ? { gridColumn: "span 3", minHeight: "32mm" } : undefined}
        >
            <div className={isPrint ? "space-y-4" : "space-y-8"}>
                <div>
                     <span className={`${isPrint ? "text-[6.5pt] text-black/30 mb-1" : "text-[10px] text-ink/30 mb-4"} tracking-[0.5em] uppercase block`}>{t("cv.education")}</span>
                     <h3 className={`font-serif ${isPrint ? "text-[16pt]" : "text-4xl md:text-5xl"} lowercase italic tracking-tighter`}>{t("cv.degrees.licence")}</h3>
                     <p className={`font-mono ${isPrint ? "text-[8pt]" : "text-xs mt-1"} text-blue font-bold tracking-[0.2em]`}>INU CHAMPOLLION / 2025</p>
                </div>
                <div>
                    <h3 className={`font-serif ${isPrint ? "text-[16pt]" : "text-4xl md:text-5xl"} lowercase italic tracking-tighter`}>{t("cv.degrees.bac")}</h3>
                    <p className={`font-mono ${isPrint ? "text-[8pt]" : "text-xs mt-1"} text-blue font-bold tracking-[0.2em]`}>LYCÉE PAUL SABATIER / 2022</p>
                </div>
            </div>
            <span className={`${isPrint ? "text-black" : "text-ink hidden md:block"} opacity-5 font-black ${isPrint ? "text-[45pt]" : "text-9xl"} leading-none`}>EDU</span>
        </div>
      </div>
    </div>
  );
}
